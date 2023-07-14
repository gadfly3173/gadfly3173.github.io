---
title: 地理信息（GIS）工具
layout: post
typora-root-url: ..
hide_post_info: false
date: 2023-07-15 00:11:46
categories:
  - 开发
tags:
  - GIS
  - java
permalink:
---

近期有个需求是打卡功能，需要判断用户位置是否在指定打卡范围内。判断打卡范围有两种思路，一种是以目标点为中心画一个圆，判断点距离圆心的距离，小于圆的半径即可；另一种则是画出电子围栏（以多个有顺序的点构筑一个多边形）判断点是否在多边形内。

# 点之间的距离

## Haversine

由于地球是椭球体，且定位所获得的经纬度是角度而不是传统意义上能表示距离的坐标，一般有两种思路，由于地球的各地半径差距不大，因此可以近似看作球体，以 Haversine 公式计算距离。注意美团的文章中的 haversine 公式有错误，本文中已修复。

参考： [https://tech.meituan.com/2014/09/05/lucene-distance.html](https://tech.meituan.com/2014/09/05/lucene-distance.html)

```java
public abstract class GeographicUtils {
    /**
	 * 地球半径.
	 */
    public static final double EARTH_RADIUS = 6378137.0;

	/**
	 * 计算两点之间的距离(Haversine公式).
	 *
	 * @param lng1 经度1
	 * @param lat1 纬度1
	 * @param lng2 经度2
	 * @param lat2 纬度2
	 * @return 距离(米)
	 */
	public static double distHaversineRAD(double lng1, double lat1, double lng2, double lat2) {
		double latDistance = Math.toRadians(lat2 - lat1);
		double lngDistance = Math.toRadians(lng2 - lng1);
		double sinLat = Math.sin(latDistance / 2);
		double sinLng = Math.sin(lngDistance / 2);
		double a = sinLat * sinLat +
				Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * sinLng * sinLng;
		double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return EARTH_RADIUS * c;
	}
}
```

## 简化：多项式拟合

由于这个算法中有大量三角函数的计算，且我们计算距离的范围一般不会超过一个省，因此可以使用多项式拟合，精度并不会下降很多。

```java
public abstract class GeographicUtils {
	/**
	 * 地球半径.
	 */
	public static final double EARTH_RADIUS = 6378137.0;
	private static final double[] POLYNOMIAL_FITTING_RESULTS = trainPolyFit(3, 1000);

	/**
	 * 多项式曲线拟合结果.
	 *
	 * @param degree 拟合次数
	 * @param length 分段粒度，100以上即可获得较好的拟合效果
	 * @return 拟合结果
	 */
	public static double[] trainPolyFit(int degree, int length) {
		PolynomialCurveFitter polynomialCurveFitter = PolynomialCurveFitter.create(degree);
		double minLat = 10.0; // 中国大陆范围（不含南海诸岛）最低纬度
		double maxLat = 60.0; // 中国大陆范围最高纬度
		double intern = (maxLat - minLat) / (double) length;
		List<WeightedObservedPoint> weightedObservedPoints = new ArrayList<>();
		for (int i = 0; i < length; i++) {
			double x = minLat + (double) i * intern;
			WeightedObservedPoint weightedObservedPoint =
					new WeightedObservedPoint(1, x, StrictMath.cos(StrictMath.toRadians(x)));
			weightedObservedPoints.add(weightedObservedPoint);
		}
		return polynomialCurveFitter.fit(weightedObservedPoints);
	}

	/**
	 * 计算两点之间的距离.
	 *
	 * @param lng1 经度1
	 * @param lat1 纬度1
	 * @param lng2 经度2
	 * @param lat2 纬度2
	 * @return 距离(米)
	 */
	public static double distanceSimplifyMore(double lng1, double lat1, double lng2, double lat2) {
		// 1) 计算三个参数
		double dx = lng1 - lng2; // 经度差值
		double dy = lat1 - lat2; // 纬度差值
		double b = (lat1 + lat2) / 2.0; // 平均纬度
		// 2) 计算东西方向距离和南北方向距离(单位：米)，东西距离采用三阶多项式
		double Lx = (POLYNOMIAL_FITTING_RESULTS[3] * b * b * b
				+ POLYNOMIAL_FITTING_RESULTS[2] * b * b
				+ POLYNOMIAL_FITTING_RESULTS[1] * b + POLYNOMIAL_FITTING_RESULTS[0])
				* Math.toRadians(dx) * EARTH_RADIUS; // 东西距离
		double Ly = EARTH_RADIUS * Math.toRadians(dy); // 南北距离
		// 3) 用平面的矩形对角距离公式计算总距离
		return Math.sqrt(Lx * Lx + Ly * Ly);
	}
}
```

## 椭球体计算：Vincenty

使用椭球体计算的 Vincenty 方法可以参考： [https://www.movable-type.co.uk/scripts/latlong-vincenty.html](https://www.movable-type.co.uk/scripts/latlong-vincenty.html)

# 电子围栏

## 射线法

电子围栏的本质是将若干个点按顺序画出多边形，判断点是否在多边形内。这也有两种算法，一种是射线法，即将点向一个方向射出一条射线（一般是右边），判断与多边形相交的点数，为奇数则说明在多边形内。算法参考：[http://alienryderflex.com/polygon/](http://alienryderflex.com/polygon/)


```java
public abstract class GeographicUtils {
	/**
	 * 判断点是否在多边形内部(射线法).
	 * <p>
	 * 该方法计算速度快，但是不精确，如果点在多边形边上，则其结果不固定.
	 *
	 * @param x       x坐标
	 * @param y       y坐标
	 * @param polygon 多边形顶点坐标
	 * @return true:在多边形内部; false:不在多边形内部
	 */
	public static boolean isPointInPolygonRayCasting(double x, double y, double[][] polygon) {
		int i;
		int j = polygon.length - 1;
		boolean oddNodes = false;
		for (i = 0; i < polygon.length; i++) {
			double[] polyI = polygon[i];
			double[] polyJ = polygon[j];
			double polyXi = polyI[0];
			double polyYi = polyI[1];
			double polyXj = polyJ[0];
			double polyYj = polyJ[1];
			if ((polyYi < y && polyYj >= y
					|| polyYj < y && polyYi >= y)
					&& (polyXi <= x || polyXj <= x)) {
				oddNodes ^= (polyXi + (y - polyYi) / (polyYj - polyYi) * (polyXj - polyXi) < x);
			}
			j = i;
		}
		return oddNodes;
	}
}
```

该算法很快但不精确，也不能判断点是否在多边形上，对于可能有负数的经纬度判断、围绕南北极点的电子围栏可能计算错误，需要处理数据，也不适合过于复杂的多边形判断。此时我们可以使用 jdk 的 Path2D 工具类实现

```java
public abstract class GeographicUtils {
	/**
	 * 使用Path2D判断点是否在多边形内，该方法很精确，但是很慢.
	 *
	 * @param x              x
	 * @param y              y
	 * @param polygon        多边形顶点坐标数组
	 * @param containsBorder 是否包含边界
	 * @return 是否在多边形内
	 */
	public static boolean isPointInPolygonPath2D(double x, double y, double[][] polygon, boolean containsBorder) {
		int numberOfVertices = polygon.length;
		Path2D.Double path = new Path2D.Double();
		// 构建多边形路径
		path.moveTo(polygon[0][0], polygon[0][1]);
		for (int i = 1; i < numberOfVertices; i++) {
			path.lineTo(polygon[i][0], polygon[i][1]);
		}
		path.closePath();
		// 创建待判断的点对象
		Point2D.Double point = new Point2D.Double(x, y);
		// 判断点是否在多边形内部
		if (path.contains(point)) {
			return true;
		}
		if (containsBorder) {
			// 排除点在多边形边上的情况
			double distanceThreshold = 1e-6; // 设置一个距离阈值作为判定边上的依据
			for (int i = 0; i < numberOfVertices; i++) {
				double[] polyI = polygon[i];
				double[] polyJ = polygon[(i + 1) % numberOfVertices];
				Line2D.Double edge = new Line2D.Double(polyI[0], polyI[1], polyJ[0], polyJ[1]);
				double distance = edge.ptSegDist(x, y);
				if (distance <= distanceThreshold) {
					return true; // 如果点到某条边的距离小于等于阈值，即判定为在边上
				}
			}
            // 该if内的判断基本等价于以下方法，但是该方法经测试会慢一些
            // 这是判断以该点构筑一个边长为1e-6的矩形是否与边界相交的方法
            // return path.intersects(x, y, distanceThreshold, distanceThreshold);
		}
		return false;
	}
}
```

电子围栏的算法以如下测试用例测试时，有约 120 倍的性能差距，因此在大陆地区的简单电子围栏使用射线法计算即可：

```java
// 1061306
// 点（3.0，4.0）是否在多边形内部？ false
// 点（2.0，2.0）是否在多边形内部？ true
// 点（-1.0，-1.0）是否在多边形内部？ true
// 点（10.0，10.0）是否在多边形内部？ false
// 8814
// 点（3.0，4.0）是否在多边形内部？ false
// 点（2.0，2.0）是否在多边形内部？ true
// 点（-1.0，-1.0）是否在多边形内部？ true
// 点（10.0，10.0）是否在多边形内部？ false


	public static void main(String[] args) {
		// 示例：判断点（3，4）是否在多边形内部
		double[][] polygon1 = {{1, 1}, {4, 3}, {6, 5}, {8, 6}, {9, 4}, {5, 2}, {1, 1}};
		double x1 = 3;
		double y1 = 4;
		double[][] polygon2 = {{0, 0}, {4, 0}, {4, 4}, {2, 6}, {-2, 4}, {-2, -2}, {0, 0}};
		double x2 = 2;
		double y2 = 2;
		double[][] polygon3 = {{0, 0}, {4, 0}, {4, 4}, {2, 6}, {-2, 4}, {-2, -2}, {0, 0}};
		double x3 = -1;
		double y3 = -1;
		double[][] polygon4 = {{0, 0}, {4, 0}, {4, 4}, {2, 6}, {-2, 4}, {-2, -2}, {0, 0}};
		double x4 = 10;
		double y4 = 10;
		long start = System.nanoTime();
		boolean isInside1 = isPointInPolygonPath2D(x1, y1, polygon1, true);
		boolean isInside2 = isPointInPolygonPath2D(x2, y2, polygon2, true);
		boolean isInside3 = isPointInPolygonPath2D(x3, y3, polygon3, true);
		boolean isInside4 = isPointInPolygonPath2D(x4, y4, polygon4, true);
		System.out.println(System.nanoTime() - start);
		System.out.println("点（" + x1 + "，" + y1 + "）是否在多边形内部？ " + isInside1);
		System.out.println("点（" + x2 + "，" + y2 + "）是否在多边形内部？ " + isInside2);
		System.out.println("点（" + x3 + "，" + y3 + "）是否在多边形内部？ " + isInside3);
		System.out.println("点（" + x4 + "，" + y4 + "）是否在多边形内部？ " + isInside4);
		start = System.nanoTime();
		isInside1 = isPointInPolygonRayCasting(x1, y1, polygon1);
		isInside2 = isPointInPolygonRayCasting(x2, y2, polygon2);
		isInside3 = isPointInPolygonRayCasting(x3, y3, polygon3);
		isInside4 = isPointInPolygonRayCasting(x4, y4, polygon4);
		System.out.println(System.nanoTime() - start);
		System.out.println("点（" + x1 + "，" + y1 + "）是否在多边形内部？ " + isInside1);
		System.out.println("点（" + x2 + "，" + y2 + "）是否在多边形内部？ " + isInside2);
		System.out.println("点（" + x3 + "，" + y3 + "）是否在多边形内部？ " + isInside3);
		System.out.println("点（" + x4 + "，" + y4 + "）是否在多边形内部？ " + isInside4);
	}
```
