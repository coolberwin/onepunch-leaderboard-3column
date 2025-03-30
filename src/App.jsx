import { useEffect, useState } from "react";
import * as Popover from "@radix-ui/react-popover"

function Leaderboard({ title, data }) {
  // 计算统计数据
  const totalCount = data.length;
  const profitCount = data.filter(d => d.profile_24h > 0).length;
  const lossCount = data.filter(d => d.profile_24h < 0).length;
  
  // 毕业人数计算 - 使用 is_graduated 不为0的成员数量
  const graduatedCount = data.filter(d => d.is_graduated && d.is_graduated !== 0).length;

  return (
    <div className="w-full max-w-[650px]">
      <h2 className="text-xl md:text-2xl font-bold mb-3 text-center text-yellow-400 whitespace-nowrap overflow-hidden text-ellipsis">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4 text-base">
        <div className="bg-gray-800 text-yellow-400 p-3 rounded-lg text-center shadow-lg border border-yellow-500">总挑战人数: {totalCount}</div>
        <div className="bg-gray-800 text-green-400 p-3 rounded-lg text-center shadow-lg border border-green-500">盈利人数: {profitCount}</div>
        <div className="bg-gray-800 text-red-400 p-3 rounded-lg text-center shadow-lg border border-red-500">亏损人数: {lossCount}</div>
        <div className="bg-gray-800 text-blue-400 p-3 rounded-lg text-center shadow-lg border border-blue-500">毕业人数: {graduatedCount}</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm bg-gray-800 shadow-xl rounded-lg border border-gray-700">
          <thead className="bg-gray-700">
            <tr className="text-yellow-400">
              <th className="p-2">排名</th>
              <th className="p-2">昵称</th>
              <th className="p-2">当日胜率</th>
              <th className="p-2">当日交易数</th>
              <th className="p-2">当日总利润(USDT)</th>
              <th className="p-2">SOL余额</th>
              <th className="p-2">钱包总利润(SOL)</th>
            </tr>
          </thead>
          <tbody className="text-gray-200">
            {data.map((item) => {
              // 确定状态图标
              let statusIcon = '';
              if (item.profile_24h > 0) {
                statusIcon = '🟢 '; // 盈利为绿色圆圈
              } else if (item.profile_24h < 0) {
                statusIcon = '🔴 '; // 亏损为红色圆圈
              } else if (item.total_trades_count === 0 || item.profile_24h === 0) {
                statusIcon = '⚪ '; // 无交易或利润为0为白色圆圈
              }
              
              // 处理名称，移除"-挑战赛"后缀
              const displayName = item.name.replace(/-\u6311\u6218\u8d5b$/, "");
              const formatNumber = (value, decimalPlaces = 2) => {
                // 如果值为空，返回"0.00"
                if (value === null || value === undefined) return "0.00";
                
                // 尝试将值转换为数字
                const num = parseFloat(value);
                
                // 检查是否是有效数字
                if (isNaN(num)) return value?.toString() || "0.00";
                
                // 格式化为两位小数
                return num.toFixed(decimalPlaces);
              };
              
              return (
                <tr key={item.rank} className="border-t border-gray-700 hover:bg-gray-700">
                  <td className="p-2 text-center w-20">{statusIcon}{item.rank}</td>
                  <td className="p-2 text-center">
                    <div className="flex items-center justify-center">
                      {displayName}
                      
                      {/* 利润等级图标 */}
                      {item.profile_24h > 0 ? (
                        <img 
                          src="../assets/wangzhe/bojin.png" 
                          className="h-5 w-5 ml-1" 
                          alt="铂金" 
                          title="盈利玩家" 
                        />
                      ) : item.profile_24h < 0 ? (
                        <img 
                          src="../assets/wangzhe/qingtong.png" 
                          className="h-5 w-5 ml-1" 
                          alt="青铜" 
                          title="亏损玩家" 
                        />
                      ) : (
                        <img 
                          src="../assets/wangzhe/huangjin.png" 
                          className="h-5 w-5 ml-1" 
                          alt="黄金" 
                          title="无盈亏玩家" 
                        />
                      )}
                      
                      {/* MVP图标（仅排名第一显示） */}
                      {item.rank === 1 && (
                        <img 
                          src="../assets/wangzhe/mvp.png" 
                          className="h-6 w-6 ml-1" 
                          alt="MVP" 
                          title="排名第一" 
                        />
                      )}
                    </div>
                  </td>
                  <td className="p-2 text-center">{formatNumber(item.win_rate) + '%'}</td>
                  <td className="p-2 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      <span>{item.today_win_count} / {item.total_trades_count}</span>
                      <a 
                        href={`https://gmgn.ai/sol/address/${item.address}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 inline-flex items-center"
                        title="查看钱包交易"
                      >
                        <img 
                          src="../assets/gmgn.png" 
                          className="h-4 w-4 hover:opacity-80 transition-opacity" 
                          alt="查看交易"
                        />
                      </a>
                    </div>
                  </td>
                  <td className={`p-2 text-center ${parseFloat(item.profile_24h) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatNumber(item.profile_24h)}
                  </td>
                  <td className="p-2 text-center">{formatNumber(item.sol_balance)}</td>
                  <td className={`p-2 text-center ${parseFloat(item.sum_profit_sol || item.sum_profit) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatNumber(item.sum_profit_sol || item.sum_profit)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Clock({updateTime}) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    // 设置挑战赛开始时间：2025年3月26日零点（北京时间）
    const startDate = new Date('2025-03-26T00:00:00+08:00');
    
    // 计算当前时间与开始时间的差值
    const calculateTimeDiff = () => {
      const now = new Date();
      const diffTime = Math.max(0, now - startDate); // 确保不会为负值
      
      // 将毫秒转换为天、时、分、秒
      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
      
      return { days, hours, minutes, seconds };
    };
    
    // 初始化时间
    setTime(calculateTimeDiff());
    
    // 每秒更新时间
    const timer = setInterval(() => {
      setTime(calculateTimeDiff());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="w-full flex flex-col items-center mb-8">
      <h1 className="text-5xl font-extrabold mb-6 text-yellow-400 tracking-wide drop-shadow-lg px-4 py-2">琦玉Saitama 挑战赛</h1>
      <div className="flex flex-row items-center justify-center gap-4 sm:gap-8">
        <img src="/assets/left1.png" alt="left" className="w-72 rounded-md" />
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-yellow-500 w-full max-w-2xl">
          <p className="text-center text-yellow-400 font-bold text-2xl mb-6">挑战赛已经开始</p>
          
          <div className="grid grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-gray-700 rounded-lg w-32 h-32 flex items-center justify-center shadow-inner border border-gray-600">
                <span className="text-5xl font-mono text-white">{String(time.days).padStart(2, '0')}</span>
              </div>
              <span className="text-base text-gray-400 mt-2">天</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-gray-700 rounded-lg w-32 h-32 flex items-center justify-center shadow-inner border border-gray-600">
                <span className="text-5xl font-mono text-white">{String(time.hours).padStart(2, '0')}</span>
              </div>
              <span className="text-base text-gray-400 mt-2">时</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-gray-700 rounded-lg w-32 h-32 flex items-center justify-center shadow-inner border border-gray-600">
                <span className="text-5xl font-mono text-white">{String(time.minutes).padStart(2, '0')}</span>
              </div>
              <span className="text-base text-gray-400 mt-2">分</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-gray-700 rounded-lg w-32 h-32 flex items-center justify-center shadow-inner border border-gray-600">
                <span className="text-5xl font-mono text-white">{String(time.seconds).padStart(2, '0')}</span>
              </div>
              <span className="text-base text-gray-400 mt-2">秒</span>
            </div>
        </div>
        {updateTime ? (
          <>
            <p className="flex justify-center text-gray-600 mt-4">
              最后更新时间: {updateTime}
            </p>
            <p className="flex justify-center text-gray-600">每30分钟更新一次</p>
          </>
        ) : null}
        </div>
        <img src="../assets/right1.png" alt="right" className="w-72 rounded-md" />
      </div>
      

      <div>
        <Popover.Root>
          <Popover.Trigger className="bg-yellow-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-lg mt-4 hover:bg-yellow-500 transition-colors">
            规则说明
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className="bg-gray-800 text-gray-200 p-4 rounded-lg shadow-lg border border-yellow-500 w-96 max-w-[90vw]">
              <h3 className="text-lg font-bold mb-3">关于挑战赛</h3>
              
              <div className="mb-3">
                <p className="text-sm font-semibold text-yellow-400">目的:</p>
                <p className="text-sm ml-4 mb-2">引导群友在交易中完善交易技能，彻底杜绝错误的交易行为，授之以鱼不如授之以渔。</p>
              </div>
              
              <div className="mb-3">
                <p className="text-sm font-semibold text-yellow-400">规则:</p>
                <ol className="list-decimal ml-8 text-sm space-y-1">
                  <li>挑战需要准备新钱包，且钱包初始金额在 2s（不能超过2.1）。</li>
                  <li>挑战期间不支持钱包转出sol，如有特殊情况，请联系小助手。</li>
                  <li>挑战者需要充足时间进行挑战。</li>
                  <li>挑战成功者在挑战成功后联系老师，申请毕业。</li>
                </ol>
              </div>
              
              <p className="text-sm mb-3">报名挑战，则默认接受规则。如违反上述规则，老师和小助手有权利对成员进行轮替。</p>
              
              <div>
                <p className="text-sm font-semibold text-yellow-400">声明:</p>
                <p className="text-sm ml-4 mb-1">挑战赛是作为社群福利，接受所有社群成员的监督和建议，若群友发现违规挑战者，可向小助手反馈。</p>
                <p className="text-sm ml-4">本活动解释权归 「琦玉Saitama 」所有，如有赛制更新，请随时关注我们的公告。</p>
              </div>
              
              <Popover.Close className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Popover.Close>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
      
      <div className="flex justify-center items-center gap-6 mt-4">
        <a href="https://x.com/qiyumeme"><img src="../assets/twitter2.png" className="w-10 h-10 hover:opacity-80 transition-opacity" /></a>
        <a href="https://t.me/yiquanchaoren"><img src="../assets/tg.png" className="w-10 h-10 hover:opacity-80 transition-opacity" /></a>
      </div>
    </div>
  );
}

function App() {
  const [teamAData, setTeamAData] = useState([]);
  const [teamBData, setTeamBData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateTime, setUpdateTime] = useState(''); // 添加更新时间状态

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 使用Vercel代理API而不是直接调用
        const response = await fetch('/api/proxy');
        if (!response.ok) {
          throw new Error(`API返回错误: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("API返回数据:", data);
        
        // 确保API返回了正确的数据结构
        if (!data.teamA || !data.teamB) {
          throw new Error('API返回数据格式不正确');
        }

        // 获取更新时间
        if (data.teamA.length > 0) {
          setUpdateTime(data.teamA[0].update_time);
        }
        
        // 按rank排序
        const sortedTeamAData = data.teamA.sort((a, b) => a.rank - b.rank);
        const sortedTeamBData = data.teamB.sort((a, b) => a.rank - b.rank);
        
        // 设置数据
        setTeamAData(sortedTeamAData);
        setTeamBData(sortedTeamBData);
      } catch (err) {
        console.error("获取数据失败:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // 设置定时刷新数据（每30分钟）
    const intervalId = setInterval(fetchData, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-4 max-w-screen-2xl mx-auto bg-yellow-50 min-h-screen flex flex-col items-center">
      <Clock updateTime={updateTime}/>
      
      {/* 显示更新时间 */}
      {/* {updateTime && (
        <div className="text-center text-gray-600 -mt-4 mb-4">
          最后更新时间: {updateTime}
        </div>
      )} */}
      
      {loading && <div className="text-gray-800 text-xl my-8 font-bold">加载数据中...</div>}
      
      {error && (
        <div className="bg-red-600 text-white p-4 rounded-lg my-8 shadow-lg">
          数据加载错误: {error}
        </div>
      )}
      
      {!loading && !error && (
        <div className="flex flex-col lg:flex-row justify-center gap-8 mt-4">
          <Leaderboard title="内敛niko 挑战组 [第1期]" data={teamAData} />
          <Leaderboard title="早起琦玉 挑战组 [第1期]" data={teamBData} />
        </div>
      )}
    </div>
  );
}

export default App;
