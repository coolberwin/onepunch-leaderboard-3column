export default async function handler(req, res) {
    try {
      // 从Vercel服务器端请求HTTP资源(不受混合内容限制)
      const apiResponse = await fetch('http://43.162.125.199:5000/api/all');
      
      if (!apiResponse.ok) {
        throw new Error(`API returned ${apiResponse.status}`);
      }
      
      const data = await apiResponse.json();
      
      // 允许CORS
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      
      // 返回数据
      return res.status(200).json(data);
    } catch (error) {
      console.error('API代理错误:', error);
      return res.status(500).json({ 
        error: '获取数据失败',
        message: error.message
      });
    }
  }