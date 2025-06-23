const express = require('express');
const app = express();
const axios = require('axios');

// 使用中间件解析JSON请求体
app.use(express.json());

// 环境变量中获取API密钥
const ALI_API_KEY = process.env.ALI_API_KEY;

// 处理生成请求
app.post('/generate', async (req, res) => {
    try {
        const { keyword1, keyword2, keyword3 } = req.body;
        
        // 验证输入
        if (!keyword1 || !keyword2 || !keyword3) {
            return res.status(400).json({
                success: false,
                error: '请提供所有三个关键词'
            });
        }
        
        // 构建提示词
        const prompt = `动漫风格人物无背景全身照，特征：${keyword1}，${keyword2}，${keyword3}`;
        
        // 调用阿里百炼API
        const response = await axios.post(
            'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
            {
                model: "wanx-style-v1.1",
                input: {
                    prompt: prompt
                },
                parameters: {
                    style: "<anime>",
                    size: "1024*1024",
                    n: 1
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${ALI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        // 检查响应状态
        if (response.data.output.task_status === 'SUCCEEDED') {
            const imageUrl = response.data.output.results[0].url;
            return res.json({
                success: true,
                image_url: imageUrl
            });
        } else {
            return res.status(500).json({
                success: false,
                error: '图片生成失败'
            });
        }
    } catch (error) {
        console.error('生成动漫人物时出错:', error);
        return res.status(500).json({
            success: false,
            error: '服务器内部错误'
        });
    }
});

// 导出为Vercel函数
module.exports = app;
