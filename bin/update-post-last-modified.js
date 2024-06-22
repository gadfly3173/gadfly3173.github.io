const fs = require('fs');
const { execSync } = require('child_process');
const yaml = require('js-yaml');
const path = require('path');

const directoryPath = 'source/_posts'; // 确保这是正确的路径

// 递归获取指定目录及其子目录下的所有Markdown文件
const getMarkdownFiles = (dir) => {
    let filesInDirectory = fs.readdirSync(dir);
    let markdownFiles = [];

    for (const file of filesInDirectory) {
        const absolute = path.join(dir, file);
        if (fs.statSync(absolute).isDirectory()) {
            markdownFiles = markdownFiles.concat(getMarkdownFiles(absolute));
        } else if (absolute.endsWith('.md')) {
            markdownFiles.push(absolute);
        }
    }

    return markdownFiles;
};

// 获取文件的最后修改时间
const getLastModifiedTime = (filePath) => {
    // 假设脚本在仓库根目录下运行，计算文件的相对路径
    const relativePath = path.relative(process.cwd(), filePath);

    const command = `git log -1 --format="%aI" "${relativePath}"`; // 使用%aI获取ISO 8601格式的日期
    try {
        const lastModifiedTime = execSync(command).toString().trim();
        console.log(`Last modified time for ${relativePath}: ${lastModifiedTime}`); // 调试输出
        return lastModifiedTime;
    } catch (error) {
        console.error(`Error getting last modified time for ${relativePath}: ${error}`);
        return null;
    }
};

// 更新Markdown文件的YAML头部
const updateFileHeader = (filePath, lastModifiedTime) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const separatorIndices = [...content.matchAll(/^---$/gm)].map(match => match.index);
    if (separatorIndices.length < 2) {
        console.log(`No YAML header found in ${filePath}. Skipping.`); // 调试输出
        return;
    }

    const yamlContent = content.substring(separatorIndices[0] + 4, separatorIndices[1]);
    let header = yaml.load(yamlContent);
    header.updated = lastModifiedTime; // 添加或更新updated字段

    const updatedYamlContent = yaml.dump(header);
    const updatedContent = `---\n${updatedYamlContent}---\n${content.substring(separatorIndices[1] + 4)}`;
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Updated ${filePath}`); // 调试输出
};

// 主函数
const updateMarkdownFiles = (dir) => {
    const files = getMarkdownFiles(dir);
    if (files.length === 0) {
        console.log('No markdown files to update.'); // 调试输出
        return;
    }
    files.forEach(filePath => {
        const lastModifiedTime = getLastModifiedTime(filePath);
        if (lastModifiedTime) {
            updateFileHeader(filePath, lastModifiedTime);
        }
    });
};

// 执行更新
updateMarkdownFiles(directoryPath);