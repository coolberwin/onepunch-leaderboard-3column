export default async function handler(req, res) {
  try {
    // 实际后端 API 地址
    const apiUrl = 'http://43.162.125.199:5000/all';
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('API代理错误:', error);
    return res.status(500).json({ error: '无法获取数据', message: error.message });
  }
}