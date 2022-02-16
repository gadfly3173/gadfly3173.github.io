---
title: Re:从零开始的问卷模块
layout: post
typora-root-url: ..
date: 2021-04-28 18:10:36
categories:
tags:
permalink:
visible:
typora-copy-images-to: ..\images\posts\2021\04
---

问卷模块是我的毕业设计的一部分。毕设论文里要求代码不能超过三页，导致我写的时候很难受，在这里写上完整的设计实现思路。

<!--More-->

项目地址：

- 前端：[https://github.com/gadfly3173/chakki-vue/](https://github.com/gadfly3173/chakki-vue)
- 后端：[https://github.com/gadfly3173/chakki-spring/](https://github.com/gadfly3173/chakki-spring)

要开发一个问卷模块，首先我们需要将问卷进行抽象，来理解一个问卷系统需要哪些数据。一个问卷中可能包含多个题目，他们可能是简答题或选择题等。一个选择题可能包含多个选项，问题可以限制选项被选择的数量。如果是矩阵选择题，那么选项将分为横轴与纵轴两种，两种选项可以两两组合变成一个唯一的选项。同时，所有的选项与问题都可以被排序。将这些条件抽象成树状的数据模型就可以是下图的形式。按照图示就可以很清晰地设计出数据库的表结构了。

![image-20210428182720196](/images/posts/2021/04/image-20210428182720196.png)

下面是数据库表结构：

| 列名        | 数据类型         | 字段类型 | 是否为空 | 默认值               | 备注     |
| ----------- | ---------------- | -------- | -------- | -------------------- | -------- |
| id          | int(10) unsigned | int      | NO       |                      |          |
| title       | varchar(60)      | varchar  | NO       |                      | 问卷标题 |
| info        | varchar(255)     | varchar  | YES      |                      | 问卷简介 |
| class_id    | int(10) unsigned | int      | NO       |                      | 对应班级 |
| end_time    | datetime(3)      | datetime | YES      |                      |          |
| create_time | datetime(3)      | datetime | NO       | CURRENT_TIMESTAMP(3) |          |
| update_time | datetime(3)      | datetime | NO       | CURRENT_TIMESTAMP(3) |          |
| delete_time | datetime(3)      | datetime | YES      |                      |          |

questionnaire表是问卷信息表，记录了问卷的标题、简介、所属的班级id、问卷的结束时间等信息。

| 列名             | 数据类型             | 字段类型 | 是否为空 | 默认值               | 备注                    |
| ---------------- | -------------------- | -------- | -------- | -------------------- | ----------------------- |
| id               | int(10) unsigned     | int      | NO       |                      |                         |
| title            | varchar(60)          | varchar  | NO       |                      | 问题标题                |
| questionnaire_id | int(10) unsigned     | int      | NO       |                      | 对应问卷                |
| order            | tinyint(2)  unsigned | tinyint  | NO       |                      | 顺序编号                |
| type             | tinyint(2)  unsigned | tinyint  | NO       |                      | 问题类型：1-简答 2-选择 |
| limit_max        | tinyint(2)  unsigned | tinyint  | YES      |                      | 多选限制数量            |
| create_time      | datetime(3)          | datetime | NO       | CURRENT_TIMESTAMP(3) |                         |
| update_time      | datetime(3)          | datetime | NO       | CURRENT_TIMESTAMP(3) |                         |
| delete_time      | datetime(3)          | datetime | YES      |                      |                         |

questionnaire_question表是问题信息表，记录了问题的标题、对应的问卷id、排序、问题类型、上限等信息。

| 列名        | 数据类型             | 字段类型 | 是否为空 | 默认值               | 备注     |
| ----------- | -------------------- | -------- | -------- | -------------------- | -------- |
| id          | int(10) unsigned     | int      | NO       |                      |          |
| title       | varchar(60)          | varchar  | NO       |                      | 选项内容 |
| question_id | int(10) unsigned     | int      | NO       |                      | 对应问卷 |
| order       | tinyint(2)  unsigned | tinyint  | NO       |                      | 顺序编号 |
| create_time | datetime(3)          | datetime | NO       | CURRENT_TIMESTAMP(3) |          |
| update_time | datetime(3)          | datetime | NO       | CURRENT_TIMESTAMP(3) |          |
| delete_time | datetime(3)          | datetime | YES      |                      |          |

questionnaire_question_option表是问卷的选择题的选项表，记录了选项名、对应的问题id、选项的排序等信息

| 列名             | 数据类型         | 字段类型 | 是否为空 | 默认值               | 备注   |
| ---------------- | ---------------- | -------- | -------- | -------------------- | ------ |
| id               | int(10) unsigned | int      | NO       |                      |        |
| user_id          | int(10) unsigned | int      | NO       |                      | 学生id |
| questionnaire_id | int(10) unsigned | int      | NO       |                      | 问卷id |
| ip               | varchar(39)      | varchar  | YES      |                      |        |
| create_time      | datetime(3)      | datetime | NO       | CURRENT_TIMESTAMP(3) |        |
| update_time      | datetime(3)      | datetime | NO       | CURRENT_TIMESTAMP(3) |        |
| delete_time      | datetime(3)      | datetime | YES      |                      |        |

 student_questionnaire表是学生与问卷的关系表，即学生的问卷提交记录，记录了用户id、问卷id、IP地址等信息。

| 列名                     | 数据类型         | 字段类型 | 是否为空 | 默认值               | 备注                 |
| ------------------------ | ---------------- | -------- | -------- | -------------------- | -------------------- |
| id                       | int(10) unsigned | int      | NO       |                      |                      |
| student_questionnaire_id | int(10)          | int      | NO       |                      | 对应的学生提交信息id |
| question_id              | int(10) unsigned | int      | NO       |                      | 问题id               |
| answer                   | varchar(255)     | varchar  | YES      |                      |                      |
| option_id                | int(10) unsigned | int      | YES      |                      |                      |
| create_time              | datetime(3)      | datetime | NO       | CURRENT_TIMESTAMP(3) |                      |
| update_time              | datetime(3)      | datetime | NO       | CURRENT_TIMESTAMP(3) |                      |
| delete_time              | datetime(3)      | datetime | YES      |                      |                      |

student_questionnaire_question_answer表是学生提交的每个问题的具体回答的记录表，记录了对应student_questionnaire的id、对应的问题id、简答题的回答内容、选择题的选项等信息。

sql建表语句如下：

```sql
-- ----------------------------
-- 问卷表
-- ----------------------------
DROP TABLE IF EXISTS `questionnaire`;
CREATE TABLE `questionnaire`
(
    `id`          int(10) UNSIGNED                                              NOT NULL AUTO_INCREMENT,
    `title`       varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci  NOT NULL COMMENT '问卷标题',
    `info`        varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL     DEFAULT NULL COMMENT '问卷简介',
    `class_id`    int(10) UNSIGNED                                              NOT NULL COMMENT '对应班级',
    `end_time`    datetime(3)                                                   NULL     DEFAULT NULL,
    `create_time` datetime(3)                                                   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_time` datetime(3)                                                   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    `delete_time` datetime(3)                                                   NULL     DEFAULT NULL,
    PRIMARY KEY (`id`) USING BTREE,
    INDEX `title_del` (`title`, `delete_time`) USING BTREE
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_general_ci
  ROW_FORMAT = Dynamic;

-- ----------------------------
-- 问题表
-- ----------------------------
DROP TABLE IF EXISTS `questionnaire_question`;
CREATE TABLE `questionnaire_question`
(
    `id`               int(10) UNSIGNED                                             NOT NULL AUTO_INCREMENT,
    `title`            varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '问题标题',
    `questionnaire_id` int(10) UNSIGNED                                             NOT NULL COMMENT '对应问卷',
    `order`            tinyint(2) UNSIGNED                                          NOT NULL COMMENT '顺序编号',
    `type`             tinyint(2) UNSIGNED                                          NOT NULL COMMENT '问题类型：1-简答 2-选择',
    `limit_max`        tinyint(2) UNSIGNED                                          NULL     DEFAULT NULL COMMENT '多选限制数量',
    `create_time`      datetime(3)                                                  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_time`      datetime(3)                                                  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    `delete_time`      datetime(3)                                                  NULL     DEFAULT NULL,
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_general_ci
  ROW_FORMAT = Dynamic;

-- ----------------------------
-- 选项表
-- ----------------------------
DROP TABLE IF EXISTS `questionnaire_question_option`;
CREATE TABLE `questionnaire_question_option`
(
    `id`          int(10) UNSIGNED                                             NOT NULL AUTO_INCREMENT,
    `title`       varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '选项内容',
    `question_id` int(10) UNSIGNED                                             NOT NULL COMMENT '对应问卷',
    `order`       tinyint(2) UNSIGNED                                          NOT NULL COMMENT '顺序编号',
    `update_time` datetime(3)                                                  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    `delete_time` datetime(3)                                                  NULL     DEFAULT NULL,
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_general_ci
  ROW_FORMAT = Dynamic;

-- ----------------------------
-- 学生-问卷 关系表
-- ----------------------------
DROP TABLE IF EXISTS `student_questionnaire`;
CREATE TABLE `student_questionnaire`
(
    `id`               int(10) UNSIGNED                                             NOT NULL AUTO_INCREMENT,
    `user_id`          int(10) UNSIGNED                                             NOT NULL COMMENT '学生id',
    `questionnaire_id` int(10) UNSIGNED                                             NOT NULL COMMENT '问卷id',
    `ip`               varchar(39) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL     DEFAULT NULL,
    `create_time`      datetime(3)                                                  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_time`      datetime(3)                                                  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    `delete_time`      datetime(3)                                                  NULL     DEFAULT NULL,
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_general_ci
  ROW_FORMAT = Dynamic;

-- ----------------------------
-- 问题-回答 关系表
-- ----------------------------
DROP TABLE IF EXISTS `student_questionnaire_question_answer`;
CREATE TABLE `student_questionnaire_question_answer`
(
    `id`                       int(10) UNSIGNED                                              NOT NULL AUTO_INCREMENT,
    `student_questionnaire_id` int(10) UNSIGNED                                              NOT NULL COMMENT '对应的学生提交信息id',
    `question_id`              int(10) UNSIGNED                                              NOT NULL COMMENT '问题id',
    `answer`                   varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL     DEFAULT NULL,
    `option_id`                int(10) UNSIGNED                                              NULL     DEFAULT NULL,
    `create_time`              datetime(3)                                                   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_time`              datetime(3)                                                   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    `delete_time`              datetime(3)                                                   NULL     DEFAULT NULL,
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_general_ci
  ROW_FORMAT = Dynamic;
```

数据模型中我并没有写上序号一项，因为前端提交时是一个数组的形式，本身就带有数据索引，后端接收到数据后，只要将这个索引作为序号填入数据库即可。对于排序的工作，由前端实现即可。因此，我们可以给出发布问卷使用的json示例：

```json
{
  "class_id": 0,
  "end_time": "",
  "info": "",
  "questions": [
    {
      "limit_max": 0,
      "options": [
        {
          "title": ""
        }
      ],
      "title": "",
      "type": 0
    }
  ],
  "title": ""
}
```

对应的实体类便是：

```java
/**
 * NewQuestionnaireDTO
 */
@Setter
@Getter
@NoArgsConstructor
@ApiModel(value = "新建问卷DTO", description = "问卷")
public class NewQuestionnaireDTO {

    @ApiModelProperty(value = "标题", required = true)
    @Length(min = 1, max = 60, message = "{lesson.questionnaire.title.not-null}")
    private String title;

    @ApiModelProperty(value = "简介")
    @Length(max = 255, message = "{lesson.questionnaire.info.length}")
    private String info;

    @ApiModelProperty(value = "班级id", name = "class_id", required = true)
    @NotNull(message = "{class.id.not-null}")
    @Min(value = 1, message = "{class.id.not-null}")
    private Integer classId;

    @ApiModelProperty(value = "问题列表", required = true)
    @Valid
    @NotNull(message = "{lesson.questionnaire.length}")
    @Size(min = 1, max = 99, message = "{lesson.questionnaire.length}")
    private List<NewQuestionDTO> questions;

    @ApiModelProperty(value = "结束时间", name = "end_time")
    private Date endTime;
}

/**
 * NewQuestionDTO
 */
@Setter
@Getter
@NoArgsConstructor
@ApiModel(value = "新建问题DTO", description = "问题")
public class NewQuestionDTO {

    @ApiModelProperty(value = "标题", required = true)
    @Length(min = 1, max = 60, message = "{lesson.questionnaire.question.title.not-null}")
    private String title;

    @ApiModelProperty(value = "类型", allowableValues = "1,2", required = true)
    @NotNull(message = "{lesson.questionnaire.question.type.not-null}")
    @Min(value = QuestionTypeConstant.TEXT, message = "{lesson.questionnaire.question.type.not-null}")
    @Max(value = QuestionTypeConstant.SELECT, message = "{lesson.questionnaire.question.type.not-null}")
    private Integer type;

    @ApiModelProperty(value = "上限，目前用于选择题", name = "limit_max", allowableValues = "range[1,10]")
    @Min(value = 1, message = "{lesson.questionnaire.question.limit.not-null}")
    @Max(value = 10, message = "{lesson.questionnaire.question.limit.not-null}")
    private Integer limitMax;

    @ApiModelProperty(value = "选项列表")
    @Valid
    @Size(max = 10, message = "{lesson.questionnaire.question.option.limit}")
    private List<NewOptionDTO> options;
}

/**
 * NewOptionDTO
 */
@Setter
@Getter
@NoArgsConstructor
@ApiModel(value = "新建选项DTO", description = "选项")
public class NewOptionDTO {

    @ApiModelProperty(value = "标题")
    @Length(min = 1, max = 60, message = "{lesson.questionnaire.question.option.title.not-null}")
    private String title;
}
```

接下来给出service类的实现，controller就省略了。由于数据库表结构上文也已经给出，对应的model类DO也不再给出。

```java
/**
 * 问题类型常量
 */
public class QuestionTypeConstant {
    /**
     * 简答
     */
    public static final int TEXT = 1;
    /**
     * 选择
     */
    public static final int SELECT = 2;
}

---------------------------------------------------------------

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void createQuestionnaire(NewQuestionnaireDTO dto) {
        // 插入问卷获取id
        QuestionnaireDO questionnaireDO = QuestionnaireDO.builder()
                .title(dto.getTitle())
                .info(dto.getInfo())
                .classId(dto.getClassId())
                .endTime(dto.getEndTime())
                .build();
        questionnaireMapper.insert(questionnaireDO);
        // 插入题目
        for (int i = 0; i < dto.getQuestions().size(); i++) {
            NewQuestionDTO questionDTO = dto.getQuestions().get(i);
            QuestionnaireQuestionDO questionnaireQuestionDO = QuestionnaireQuestionDO.builder()
                    .questionnaireId(questionnaireDO.getId())
                    .title(questionDTO.getTitle())
                    .order(i)
                    .type(questionDTO.getType())
                    .limitMax(questionDTO.getLimitMax())
                    .build();
            questionnaireQuestionMapper.insert(questionnaireQuestionDO);
            // 如果是选择题，且选项列表不为空则插入选项
            if (questionDTO.getType() == QuestionTypeConstant.SELECT
                    && questionDTO.getOptions() != null
                    && !questionDTO.getOptions().isEmpty()) {
                for (int k = 0; k < questionDTO.getOptions().size(); k++) {
                    NewOptionDTO optionDTO = questionDTO.getOptions().get(k);
                    QuestionnaireQuestionOptionDO questionnaireQuestionOptionDO =
                         QuestionnaireQuestionOptionDO.builder()
                            .questionId(questionnaireQuestionDO.getId())
                            .title(optionDTO.getTitle())
                            .order(k)
                            .build();
                    questionnaireQuestionOptionMapper.insert(questionnaireQuestionOptionDO);
                }
            }
        }
    }
```

可以看到代码逻辑很简单，直接循环DTO中接收到的所有参数，一一对应插入数据库即可。因为DTO中没有给到排序编号，因此使用的是普通fori循环来得到数组每项的下标作为编号。

然后来看看前端部分，新建问卷页面关键代码如下：

```html
<template>
  <div class="container" v-loading="loading">
    <div class="header">
      <div class="title">{{ $route.params.id === '0' ? '新建' : '编辑' }}问卷</div>
      <div class="deploy-button"><el-button type="primary" @click.stop="deploy">发布</el-button></div>
    </div>
    <div class="wrapper">
      <div class="title-input">
        <label>问卷标题：</label>
        <el-input size="medium" clearable v-model="title" :maxlength="60" show-word-limit></el-input>
      </div>
      <div class="info-input">
        <label>问卷简介：</label>
        <el-input
          size="medium"
          type="textarea"
          :autosize="{ minRows: 2 }"
          clearable
          v-model="info"
          :maxlength="255"
          show-word-limit
        ></el-input>
      </div>
      <div class="questions">
        <el-row>
          <el-col :span="6" class="toolbar">
            <div class="add-button">
              <el-button type="text" class="button" icon="el-icon-circle-plus-outline" @click="addTextQuestion"
                >新建简答题</el-button
              >
            </div>
            <div class="add-button">
              <el-button type="text" class="button" icon="el-icon-circle-plus-outline" @click="addSelectQuestion"
                >新建选择题</el-button
              >
            </div>
          </el-col>
          <el-col :span="18" class="right-col">
            <el-scrollbar key="scrollbar" class="scrollbar">
              <div class="mask top-mask"></div>
              <div class="end-time-input">
                结束时间：
                <el-date-picker
                  v-model="endTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  align="right"
                  :editable="false"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
              </div>
              <div v-if="!list || list.length === 0" class="hint-box">
                点击左侧按钮新建题目
              </div>
              <draggable
                v-else
                class="list-group"
                tag="ul"
                v-model="list"
                v-bind="dragOptions"
                handle=".handle"
                @start="drag = true"
                @end="drag = false"
              >
                <transition-group type="transition" name="flip-list">
                  <li class="list-group-item" v-for="(element, index) in list" :key="`question-${index}`">
                    <i class="anticon icon-bars handle"
                      ><span class="order">{{ index + 1 }}.</span></i
                    >
                    <div class="question">
                      <span class="question-title">
                        <div class="label">
                          问题：
                        </div>
                        <el-input
                          class="title-input"
                          placeholder="请输入标题"
                          size="medium"
                          v-model="element.title"
                          :maxlength="60"
                          clearable
                          show-word-limit
                        >
                        </el-input>
                      </span>
                      <div class="question-type">
                        类型：{{ element.type | questionTypeFilter }}
                        <span v-if="element.type === 2" class="limit">
                          选项可选数量上限：
                          <el-input-number
                            class="limit-max-input"
                            v-model="element.limit_max"
                            size="mini"
                            controls-position="right"
                            :step-strictly="true"
                            :min="1"
                            :max="10"
                          ></el-input-number>
                        </span>
                      </div>
                      <!-- 选择题选项 -->
                      <div class="question-options" v-if="element.type === 2">
                        <i class="iconfont icon-jia plus" v-if="!element.options.length" @click="addOption(index)"></i>
                        <el-row class="option-row" v-for="(item, key) in element.options" :key="key">
                          <div class="option-hint">选项{{ key + 1 }}</div>
                          <el-input
                            v-model="item.title"
                            :maxlength="60"
                            show-word-limit
                            clearable
                            placeholder="请输入选项"
                            size="medium"
                            class="option-input"
                          ></el-input>
                          <div class="function">
                            <i class="iconfont icon-jian1 minus" @click="removeOption(index, key)"></i>
                            <i
                              class="iconfont icon-jia plus"
                              v-if="key === element.options.length - 1 && element.options.length < 10"
                              @click="addOption(index)"
                            ></i>
                          </div>
                        </el-row>
                      </div>
                    </div>
                    <i class="el-icon-close" @click="removeQuestion(index)"></i>
                  </li>
                </transition-group>
              </draggable>
              <div class="mask bottom-mask"></div>
            </el-scrollbar>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import Class from '@/model/class'
import draggable from 'vuedraggable'

export default {
  data() {
    return {
      title: '',
      info: '',
      endTime: null,
      loading: false,
      drag: false,
      dragOptions: {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '五分钟后',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 5 * 60 * 1000)
              picker.$emit('pick', date)
            },
          },
          // 其他的自行撰写
        ],
        disabledDate(date) {
          return date.getTime() <= new Date().getTime() - 3600 * 1000 * 24
        },
      },
      list: [],
    }
  },
  components: {
    draggable,
  },
  computed: {
    currentClassId() {
      return this.$store.state.currentClassId
    },
  },
  methods: {
    addTextQuestion() {
      this.list.push({
        title: '',
        type: 1,
      })
    },
    addSelectQuestion() {
      this.list.push({
        title: '',
        type: 2,
        limit_max: 1,
        options: [],
      })
    },
    addOption(index) {
      this.list[index].options.push({
        title: '',
      })
    },
    removeOption(index, key) {
      this.list[index].options.splice(key, 1)
    },
    removeQuestion(index) {
      this.list.splice(index, 1)
    },
    async getQuestionnaireVO() {
      // TODO 编辑问卷
      const res = await Class.getQuestionnaireVO(this.$route.params.id)
      this.title = res.title
    },
    async deploy() {
      try {
        this.loading = true
        if (this.$route.params.id === '0') {
          // 发布问卷
          const res = await Class.createQuestionnaire(
            this.title,
            this.info,
            this.currentClassId,
            this.end_time,
            this.list,
          )
          if (res.code < window.MAX_SUCCESS_CODE) {
            this.loading = false
            this.$message.success('问卷发布成功')
          }
        } else {
          // 更新问卷
          const res = await Class.updateQuestionnaire(this.$route.params.id, this.title, this.content)
          if (res.code < window.MAX_SUCCESS_CODE) {
            this.loading = false
            this.$message.success('问卷修改成功')
          } else {
            this.$message.error(res.message)
          }
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
  },
  created() {
    if (this.$route.params.id !== '0') {
      this.getQuestionnaireVO()
    }
  },
}
</script>

<style lang="scss" scoped>
.flip-list-move {
  transition: transform 0.5s;
}
.flip-list-enter-active {
  transition: opacity 0.5s;
}
.flip-list-enter {
  opacity: 0;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.container {
  padding: 0 30px;
  color: #596c8e;
  height: 100%;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #dae1ec;
    height: 59px;
    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
      text-indent: 40px;
    }
    .deploy-button {
      margin: 0 40px;
    }
  }

  .wrapper {
    height: calc(100% - 80px);
    .title-input {
      display: flex;
      padding: 20px 20px 0;
      label {
        width: 120px;
        line-height: 36px;
      }
    }
    .info-input {
      display: flex;
      padding: 20px;
      border-bottom: 1px dashed #dae1ec;
      label {
        width: 120px;
        line-height: 36px;
      }
    }
    .questions {
      height: calc(100% - 150px);
      /deep/ .el-row {
        height: 100%;
      }
      .toolbar {
        border-right: 1px solid #dae1ec;
        height: 100%;
        text-align: right;
        display: flex;
        align-items: flex-end;
        flex-direction: column;
        justify-content: center;
        .add-button {
          margin: 10px 20px;
          .button {
            font-size: 20px;
          }
        }
      }
      .scrollbar {
        height: 100%;
        /deep/ .el-scrollbar__wrap {
          overflow-x: hidden;
        }
      }
      .right-col {
        height: 100%;
      }
      .end-time-input {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #dae1ec;
        /deep/ .el-input__inner {
          cursor: pointer;
        }
      }
      .hint-box {
        text-align: center;
        padding: 20vh 0;
        color: #dcdfe6;
      }
      .mask {
        position: absolute;
        z-index: 100;
        width: 100%;
        height: 50px;
        pointer-events: none;
        &.top-mask {
          top: 0;
          background: linear-gradient(rgb(249, 250, 251), rgba(249, 250, 251, 0));
        }
        &.bottom-mask {
          bottom: 0;
          background: linear-gradient(rgba(249, 250, 251, 0), rgb(249, 250, 251));
        }
      }
      .list-group {
        min-height: 20px;
        width: 90%;
        padding: 0 20px;
        margin: 0 auto;
        .list-group-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 15px 0;
          padding-bottom: 10px;
          border-bottom: 1px dashed #d5eae6;
          .handle {
            font-size: 20px;
            font-weight: 700;
            cursor: move;
            padding: 20px 0;
            &:hover {
              transform: scale(1.2);
            }
          }
          .order {
            margin: 0 10px;
          }
          .el-icon-close {
            font-weight: 700;
            cursor: pointer;
            padding: 5px;
            color: #c7485b;
            font-size: 20px;
            &:hover {
              transform: scale(1.2);
            }
          }
          .question-title {
            display: flex;
            align-items: center;
            margin: 10px 0;
            .label {
              width: 50px;
            }
            .title-input {
              width: 350px;
              padding: 0;
            }
          }
          .question-type {
            font-size: 14px;
            margin: 10px 0;
            .limit {
              padding-left: 30px;
              .limit-max-input {
                width: 80px;
              }
            }
          }
          .question-options {
            padding-top: 10px;
            .iconfont {
              cursor: pointer;
              font-size: 20px;
              font-weight: 700;
              &.plus {
                color: #3765b6;
              }
              &.minus {
                font-size: 22px;
                color: #c7485b;
              }
            }
            .option-row {
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 400px;
              margin-bottom: 10px;
              .option-hint {
                width: 60px;
              }
              .option-input {
                width: 300px;
                margin-right: 5px;
              }
              .function {
                display: flex;
                justify-content: space-between;
                width: 60px;
                height: 36px;
                line-height: 36px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
```

拖拽排序使用的是vuedraggable，使用方法请自行查阅官方文档。

学生提交问卷时，则需要上传问卷id、自己的回答列表即可。回答本身可能有简答与选择的选项两种情况，由于两者类型不同，因此使用两个不同的字段answer和option_id存储。对于学生提交问卷回答部分就不再展示代码，

教师查询学生的提交记录时则是下载一个包含所有提交记录的Excel文件。Excel的写入可以使用Apache POI来完成。Apache POI对Excel类型的文件有三种创建方式，HSSF、XSSF、SXSSF。HSSF是用于生成Office 97-2003的旧版本xls文件，XSSF用于生成新版本的xlsx文件，而SXSSF则是在XSSF的基础上进行扩展，可以避免过大的数据导致内存溢出。由于问卷是针对班级为单位发布的，数据量不会超过100行，因此使用XSSF形式进行生成即可。POI对Excel的操作是以行为单位的，每行每列都是从0开始。因此需要通过createRow方法先创建标题行，然后遍历学生提交的答案来填充数据，最后写入临时文件并返回。

```java
    @Override
    public FileExportBO getQuestionnaireReportFile(Integer id) throws IOException {
        // 查询问卷本体
        QuestionnaireVO questionnaireVO = questionnaireMapper.getQuestionnaireVO(id);
        // 查询学生提交记录
        List<StudentQuestionnaireAnswerVO> answerVOList = studentQuestionnaireMapper.selectStudentQuestionnaireAnswerVO(id);
        // Apache POI 创建 Excel
        XSSFWorkbook wb = new XSSFWorkbook();
        XSSFSheet sheet = wb.createSheet("Sheet 1");
        // 设置时间格式
        XSSFCreationHelper creationHelper = wb.getCreationHelper();
        CellStyle cellStyle = wb.createCellStyle();
        cellStyle.setDataFormat(creationHelper.createDataFormat().getFormat("yyyy-MM-dd HH:mm:ss.SSS"));
        // 标题行
        XSSFRow titleRow = sheet.createRow(0);
        titleRow.createCell(0).setCellValue("学号");
        titleRow.createCell(1).setCellValue("姓名");
        // 问题题目作为标题
        for (int i = 0; i < questionnaireVO.getQuestions().size(); i++) {
            titleRow.createCell(i + 2).setCellValue(String.format("第%d题：%s",
                    i + 1,
                    questionnaireVO.getQuestions().get(i).getTitle()));
        }
        titleRow.createCell(questionnaireVO.getQuestions().size() + 2).setCellValue("提交时间");
        // 学生回答内容写入
        for (int i = 0; i < answerVOList.size(); i++) {
            XSSFRow row = sheet.createRow(i + 1);
            row.createCell(0).setCellValue(answerVOList.get(i).getUsername());
            row.createCell(1).setCellValue(answerVOList.get(i).getNickname());
            // 遍历问题
            for (int j = 0; j < questionnaireVO.getQuestions().size(); j++) {
                // 简答题写入answer
                if (questionnaireVO.getQuestions().get(j).getType().equals(QuestionTypeConstant.TEXT)) {
                    row.createCell(j + 2).setCellValue(answerVOList.get(i).getAnswers().get(j).getAnswer());
                    continue;
                }
                // 选择题查询选项原文写入
                if (questionnaireVO.getQuestions().get(j).getType().equals(QuestionTypeConstant.SELECT)) {
                    // 初始化StringJoiner用来存放原文
                    StringJoiner optionTitles = new StringJoiner(",");
                    for (Integer optionId : answerVOList.get(i).getAnswers().get(j).getOptionId()) {
                        for (OptionVO optionVO : questionnaireVO.getQuestions().get(j).getOptions()) {
                            // 如果id相同就加一条
                            if (optionVO.getId().equals(optionId)) {
                                optionTitles.add(optionVO.getTitle());
                            }
                        }
                    }
                    row.createCell(j + 2).setCellValue(optionTitles.toString());
                }
            }
            // 写入创建时间
            XSSFCell datetimeCell = row.createCell(questionnaireVO.getQuestions().size() + 2);
            datetimeCell.setCellValue(answerVOList.get(i).getCreateTime());
            datetimeCell.setCellStyle(cellStyle);
        }
        // 写入临时文件
        File excelFile = File.createTempFile(String.valueOf(System.currentTimeMillis()), ".xlsx");
        FileOutputStream outputStream = new FileOutputStream(excelFile);
        wb.write(outputStream);
        outputStream.close();
        // 格式化文件名
        String filename = String.format("问卷调查结果_%s.xlsx", questionnaireVO.getTitle());
        return FileExportBO.builder()
                .file(excelFile)
                .filename(filename)
                .build();
    }
```
