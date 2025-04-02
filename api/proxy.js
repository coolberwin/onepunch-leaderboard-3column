export default async function handler(req, res) {
  // 允许预检请求通过
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }
  
  try {
    // 获取请求路径
    const path = req.query.path || 'all';
    
    // 构建完整 API URL
    const apiUrl = `http://43.162.125.199:5000/${path}`;
    console.log(`请求API: ${apiUrl}`);
    
    // 转发请求到实际 API
    const apiResponse = await fetch(apiUrl, {
      method: req.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...req.headers,
        // 移除可能导致问题的头
        host: undefined,
        referer: undefined
      },
      // 如果是有body的请求，转发body
      body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined
    });
    
    if (!apiResponse.ok) {
      console.error(`API错误: ${apiResponse.status}`);
      throw new Error(`API返回错误状态: ${apiResponse.status}`);
    }
    
    // 解析API响应
    const data = await apiResponse.json();
    
    // 设置CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // 返回API响应数据
    return res.status(200).json(data);
  } catch (error) {
    console.error('API代理错误:', error);
    return res.status(500).json({ 
      error: '获取数据失败',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}