function generateCharacter() {
    const keyword1 = keyword1Input.value.trim();
    const keyword2 = keyword2Input.value.trim();
    const keyword3 = keyword3Input.value.trim();
    
    // 验证输入
    if (!keyword1 || !keyword2 || !keyword3) {
        showError('请填写所有三个关键词');
        return;
    }
    
    // 清除错误信息
    hideError();
    
    // 显示加载状态
    imagePlaceholder.style.display = 'none';
    resultImage.style.display = 'none';
    loading.style.display = 'block';
    actionButtons.style.display = 'none';
    generateBtn.disabled = true;
    
    // 构建提示词（在本地显示）
    const prompt = `动漫风格人物无背景全身照，特征：${keyword1}，${keyword2}，${keyword3}`;
    promptText.textContent = prompt;
    
    // 发送请求到后端
    fetch('/api/generate', {  // 这里修改了端点路径
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            keyword1: keyword1,
            keyword2: keyword2,
            keyword3: keyword3
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || '服务器返回错误');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // 添加时间戳参数防止浏览器缓存
            const timestamp = new Date().getTime();
            const uniqueUrl = `${data.image_url}?t=${timestamp}`;
            
            // 显示生成的图片
            resultImage.src = uniqueUrl;
            resultImage.onload = function() {
                // 图片加载成功后显示
                resultImage.style.display = 'block';
                
                // 显示操作按钮
                actionButtons.style.display = 'flex';
            };
            
            // 处理图片加载失败
            resultImage.onerror = function() {
                console.error('图片加载失败:', uniqueUrl);
                showError('图片加载失败，请尝试重新生成');
                imagePlaceholder.style.display = 'block';
            };
        } else {
            throw new Error(data.error || '生成失败');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('生成失败: ' + error.message);
        imagePlaceholder.style.display = 'block';
    })
    .finally(() => {
        loading.style.display = 'none';
        generateBtn.disabled = false;
    });
}
