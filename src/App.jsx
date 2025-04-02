import React, { useState, useEffect } from "react";
import * as Popover from "@radix-ui/react-popover"

// 格式化数字函数 - 改为2位小数
const formatNumber = (value, decimalPlaces = 2) => {
  if (value === null || value === undefined) return "0.00";
  const num = parseFloat(value);
  return isNaN(num) ? (value?.toString() || "0.00") : num.toFixed(decimalPlaces);
};

// 更新的LeaderboardItem组件
const LeaderboardItem = ({ rank, name, avatar, winRate, tradeCount, profit, balance, totalProfit, isAlternate, isFirst, address, isGraduated }) => {
  const bgClass = isAlternate ? 'bg-challenge-alt' : 'bg-challenge';
  const rowHeight = isFirst ? 'h-16' : 'h-10';
  
  // 处理利润颜色
  const getProfitClass = (value) => {
    const numValue = parseFloat(value);
    if (numValue > 0) return "profit-positive";
    if (numValue < 0) return "profit-negative";
    return "profit-zero";
  };
  
  // 确定状态图标
  let statusIcon = '';
  const profitValue = parseFloat(profit);
  if (profitValue > 0) {
    statusIcon = '🟢 '; // 盈利为绿色圆圈
  } else if (profitValue < 0) {
    statusIcon = '🔴 '; // 亏损为红色圆圈
  } else {
    statusIcon = '⚪ '; // 无交易或利润为0为白色圆圈
  }
  
  // 处理名称，移除"-挑战赛"后缀
  const displayName = name.replace(/-\u6311\u6218\u8d5b$/, "");
  
  return (
    <div className={`${bgClass} w-full ${rowHeight} flex items-center px-6`}>
      <div className="flex items-center w-[10%]">
        <span className="text-white text-sm">{statusIcon}{rank}</span>
      </div>
      
      <div className="flex items-center w-[25%]">
        <span className="text-white text-sm truncate mr-1">{displayName}</span>
        {avatar && <img src={avatar} alt="" className="w-[17px] h-[17px] rounded-full" />}
        
        {/* 毕业标签 */}
        {/* {isGraduated && (
          <span className="ml-1 px-2 py-0.5 bg-challenge-blue bg-opacity-20 text-challenge-blue text-xs font-medium rounded-full border border-challenge-blue">
            毕业
          </span>
        )} */}
        {isGraduated == 1 ? (
          <span className="ml-1 px-2 py-0.5 bg-challenge-blue bg-opacity-20 text-challenge-blue text-xs font-medium rounded-full border border-challenge-blue">
            毕业
          </span>
        ) : (
          <span className="ml-1">&nbsp;</span> // 显示一个空格
        )} 

        {/* 等级图标 - 使用三元表达式统一处理 */}
        {!isGraduated && (
          <img 
            src={
              profitValue > 0 
                ? "/assets/wangzhe/bojin.png"
                : profitValue < 0
                  ? "/assets/wangzhe/qingtong.png"
                  : "/assets/wangzhe/huangjin.png"
            }
            className="w-[17px] h-[17px] ml-1" 
            alt={
              profitValue > 0 
                ? "铂金"
                : profitValue < 0
                  ? "青铜"
                  : "黄金"
            }
            title={
              profitValue > 0 
                ? "盈利玩家"
                : profitValue < 0
                  ? "亏损玩家"
                  : "无盈亏玩家"
            }
          />
        )}
        
        {/* MVP图标 */}
        {isFirst && (
          <img 
            src="/assets/wangzhe/mvp.png" 
            className="w-[18px] h-[18px] ml-1" 
            alt="MVP"
            title="排名第一"
          />
        )}
      </div>
      
      <div className="text-white text-sm w-[12%] text-right">{formatNumber(winRate)}%</div>
      <div className="flex justify-end items-center w-[12%]">
        <span className="text-white text-sm mr-1">{tradeCount}</span>
        
        {/* 添加交易查看链接 */}
        {address && (
          <a 
            href={`https://gmgn.ai/sol/address/${address}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="cursor-pointer"
            title="查看钱包交易"
          >
            <img 
              src="/assets/gmgn.png" 
              alt="查看交易" 
              className="w-[14px] h-[14px]"
            />
          </a>
        )}
      </div>
      <div className={`text-sm w-[12%] text-right ${getProfitClass(profit)}`}>{formatNumber(profit)}</div>
      <div className="text-white text-sm w-[12%] text-right">{formatNumber(balance)}</div>
      <div className={`text-sm w-[12%] text-right ${getProfitClass(totalProfit)}`}>{formatNumber(totalProfit)}</div>
    </div>
  );
};

// 挑战组件 - 修改ChallengeGroup组件，加入动态计算统计数据的逻辑
const ChallengeGroup = ({ title, data, style }) => {
  // 计算统计数据
  const totalCount = data.length;
  const profitCount = data.filter(d => parseFloat(d.profit) > 0).length;
  const lossCount = data.filter(d => parseFloat(d.profit) < 0).length;
  // 毕业人数计算 - 使用 isGraduated 属性
  const graduatedCount = data.filter(d => d.isGraduated).length;
  
  return (
    <div className="relative w-[768px] h-auto mb-10" style={style}> 
      {/* 标题 */}
      <div className="h-14 bg-center bg-no-repeat flex justify-center" style={{backgroundImage: "url(/assets/lanhu/title-bg.png)"}}>
        <h3 className="text-white text-[22px] font-bold pt-[15px]">{title}</h3>
      </div>

      {/* 统计数据 - 更新为动态计算的值 */}
      <div className="stat-container">
        <div className="bg-challenge rounded-[4px] h-14 w-full flex items-center justify-center">
          <span className="text-challenge-yellow text-[20px]">总挑战人数:{totalCount}</span>
        </div>
        <div className="bg-challenge rounded-[4px] h-14 w-full flex items-center justify-center">
          <span className="text-challenge-green text-[20px]">盈利人数:{profitCount}</span>
        </div>
        <div className="bg-challenge rounded-[4px] h-14 w-full flex items-center justify-center">
          <span className="text-challenge-red text-[20px]">亏损人数:{lossCount}</span>
        </div>
        <div className="bg-challenge rounded-[4px] h-14 w-full flex items-center justify-center">
          <span className="text-challenge-blue text-[20px]">毕业人数:{graduatedCount}</span>
        </div>
      </div>
      
      {/* 表格头部 */}
      <div className="bg-challenge-header rounded-[4px] mx-auto w-[694px] h-[81px] flex items-center px-6 mt-[18px]">
        <div className="w-[10%] text-challenge-gray text-[14px]">排名</div>
        <div className="w-[25%] text-challenge-gray text-[14px]">昵称</div>
        <div className="w-[12%] text-challenge-gray text-[14px] text-right">当日胜率</div>
        <div className="w-[12%] text-challenge-gray text-[14px] text-right">当日交易数</div>
        <div className="w-[12%] text-challenge-gray text-[14px] text-right">
          当日总利润<br />(USDT)
        </div>
        <div className="w-[12%] text-challenge-gray text-[14px] text-right">SOL余额</div>
        <div className="w-[12%] text-challenge-gray text-[14px] text-right">
          钱包总利润<br />(SOL)
        </div>
      </div>
      
      {/* 排名列表 */}
      <div className="mx-auto w-[694px] mt-0">
        {data.map((item, index) => (
          <LeaderboardItem 
            key={index}
            rank={item.rank} 
            name={item.name}
            avatar={item.avatar}
            winRate={item.winRate}
            tradeCount={item.tradeCount}
            profit={item.profit}
            balance={item.balance}
            totalProfit={item.totalProfit}
            isAlternate={index % 2 !== 0}
            isFirst={index === 0}
            address={item.address}
            isGraduated={item.isGraduated}
          />
        ))}
      </div>
    </div>
  );
};

function App() {
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 13,
    minutes: 21,
    seconds: 2
  });
  
  const [mockData1, setMockData1] = useState([]);
  const [mockData2, setMockData2] = useState([]);
  const [updateTime, setUpdateTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const transformApiData = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) return [];
    
    return apiData.map(item => ({
      rank: item.rank,
      name: item.name || '未知用户',
      avatar: item.avatar_url,
      winRate: item.win_rate ? item.win_rate + '%' : '0.00%',
      tradeCount: `${item.today_win_count || 0} / ${item.total_trades_count || 0}`,
      profit: item.profile_24h || 0,
      balance: item.sol_balance || 0,
      totalProfit: item.sum_profit_sol || item.sum_profit || 0,
      address: item.address,
      // 添加毕业状态属性
      isGraduated: item.is_graduated && item.is_graduated !== 0
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 使用代理API路径
        const response = await fetch('/api/proxy?path=all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          console.error(`API错误: ${response.status}`);
          const errorText = await response.text();
          throw new Error(`API错误 ${response.status}: ${errorText}`);
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
        
        // 转换API数据为组件所需格式
        const transformedTeamA = transformApiData(data.teamA);
        const transformedTeamB = transformApiData(data.teamB);
        
        setMockData1(transformedTeamA);
        setMockData2(transformedTeamB);
      } catch (err) {
        console.error("获取数据失败:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // 设置定时刷新数据
    const intervalId = setInterval(fetchData, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // 社交媒体链接处理
  const handleTwitterClick = () => {
    window.open('https://x.com/qiyumeme', '_blank');
  };

  const handleTelegramClick = () => {
    window.open('https://t.me/yiquanchaoren', '_blank');
  };

  useEffect(() => {
    // 设置挑战赛开始时间：2025年3月26日零点（北京时间）
    const startDate = new Date('2025-03-27T00:00:00+08:00');
    
    // 计算初始时间差
    const calculateTimeDiff = () => {
      const now = new Date();
      // 如果还未到达开始时间，返回全0
      if (now < startDate) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      // 计算毫秒差值
      const diffTime = now - startDate;
      
      // 转换为天、时、分、秒
      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
      
      return { days, hours, minutes, seconds };
    };
    
    // 设置初始时间
    setTimeLeft(calculateTimeDiff());
    
    // 每秒更新一次
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeDiff());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="page">
      <div className="w-full">
        {/* <img src="../public/assets/banner.png" alt="banner" className="w-full" /> */}
        <img src="./assets/banner.png" alt="banner" className="w-full" />
      </div>

      {/* 挑战赛已开始样式 - 使用纯Tailwind */}
      <div className="flex justify-center mb-2">
        <div className="relative inline-block">
          <img 
            src="/assets/bg.png" 
            alt="背景" 
            className="rounded-xl shadow-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-[50px] font-black tracking-[1px] leading-[62px] text-challenge-yellow m-0 font-['HYLiLiangHeiJ']">
              挑战赛已开始
            </h3>
          </div>
        </div>
      </div>
      
      <div className="content-container">
        {/* 主内容区域 */}
        <div className="w-full bg-no-repeat bg-cover" style={{ backgroundImage: "url(/assets/lanhu/main-bg.png)" }}>
        {/* 倒计时 */}
        <div className="time-container">
          <div className="timer-unit">
            <div className="timer-bg" style={{backgroundImage: "url(/assets/lanhu/timer-bg.png)"}}>
              <span className="text-[#46332D] text-[68px] font-normal tracking-[1.36px]">{String(timeLeft.days).padStart(2, '0')}</span>
            </div>
            <span className="text-white text-[18px] font-normal tracking-[0.36px] mt-[9px]">天</span>
          </div>
          
          <div className="timer-unit">
            <div className="timer-bg" style={{backgroundImage: "url(/assets/lanhu/timer-bg.png)"}}>
              <span className="text-[#46332D] text-[68px] font-normal tracking-[1.36px]">{String(timeLeft.hours).padStart(2, '0')}</span>
            </div>
            <span className="text-white text-[18px] font-normal tracking-[0.36px] mt-[9px]">时</span>
          </div>
          
          <div className="timer-unit">
            <div className="timer-bg" style={{backgroundImage: "url(/assets/lanhu/timer-bg.png)"}}>
              <span className="text-[#46332D] text-[68px] font-normal tracking-[1.36px]">{String(timeLeft.minutes).padStart(2, '0')}</span>
            </div>
            <span className="text-white text-[18px] font-normal tracking-[0.36px] mt-[9px]">分</span>
          </div>
          
          <div className="timer-unit">
            <div className="timer-bg" style={{backgroundImage: "url(/assets/lanhu/timer-bg.png)"}}>
              <span className="text-[#46332D] text-[68px] font-normal tracking-[1.36px]">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
            <span className="text-white text-[18px] font-normal tracking-[0.36px] mt-[9px]">秒</span>
          </div>
        </div>
          
          {/* 更新时间 - 改进的Tailwind样式 */}
          {/* <div className="flex justify-center mt-[18px]">
            <div className="bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-lg border border-gray-700 px-6 py-3 shadow-md">
              <p className="text-challenge-yellow text-[14px] font-medium tracking-wide text-center">
                最后更新时间:&nbsp;2025-03-31&nbsp;12:32:56
                <br />
                <span className="text-gray-300 text-[12px]">大约每30分钟更新一次</span>
              </p>
            </div>
          </div> */}
          {/* 更新时间 - 黄色标题灰色副文本 */}
          <div className="flex justify-center mt-[18px]">
            <div className="px-6 py-3">
              <p className="text-gray-300 text-[14px] font-medium tracking-wide text-center">
                最后更新时间:&nbsp;{updateTime}
                <br />
                <span className="text-gray-300 text-[12px]">大约每30分钟更新一次</span>
              </p>
            </div>
          </div>


          {/* 规则按钮和图标 */}
          <div className="flex flex-col items-center mt-[22px]">
            {/* <div className="border border-challenge-yellow rounded-[22px] h-[44px] w-[110px] flex items-center justify-center">
              <span className="text-challenge-yellow text-[14px] font-normal tracking-[0.28px] leading-[20px]">规则说明</span>
            </div> */}
            <Popover.Root>
                <Popover.Trigger asChild>
                  <div className="border border-challenge-yellow rounded-[22px] h-[44px] w-[110px] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                    <span className="text-challenge-yellow text-[14px] font-normal tracking-[0.28px] leading-[20px]">规则说明</span>
                  </div>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content className="bg-[#1A1A1A] text-gray-200 p-4 rounded-lg shadow-lg border border-challenge-yellow w-96 max-w-[90vw] animate-fadeIn z-50">
                    <h3 className="text-lg font-bold mb-3 text-challenge-yellow">关于挑战赛</h3>
                    
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-challenge-yellow">目的:</p>
                      <p className="text-sm ml-4 mb-2">引导群友在交易中完善交易技能，彻底杜绝错误的交易行为，授之以鱼不如授之以渔。</p>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-challenge-yellow">规则:</p>
                      {/* <ol className="list-decimal ml-8 text-sm space-y-1">
                        <li>挑战需要准备新钱包，且钱包初始金额在 2s（不能超过2.1）。</li>
                        <li>挑战期间不支持钱包转出sol，如有特殊情况，请联系小助手。</li>
                        <li>挑战者需要充足时间进行挑战。</li>
                        <li>挑战成功者在挑战成功后联系老师，申请毕业。</li>
                      </ol> */}
                        <ol className="list-decimal ml-8 text-sm space-y-1">
                          <li>创建新钱包并转入2.1/4.1 S（0.1S误差），开赛前1天需告知助理；</li>
                          <li>每位挑战者需在挑战期间，必须必须每晚按时发布推特复盘🔖；</li>
                          <li>每期当20个参与者达成目标后，即算挑战结束。未完成者可作为补充人员参与后两组比赛，机会仅限一次；若仍未达标，则需等到下一期挑战赛再参加💥；</li>
                          <li>分润规则💰：当达成8 SOL目标后，每位挑战者分润给老师1 SOL；当达成16 SOL目标后，每位挑战者分润给老师2 SOL；</li>
                          <li>参赛期间请勿随意转入或转出SOL；</li>
                        </ol>
                    </div>
                    
                    <p className="text-sm mb-3">报名挑战，则默认接受规则。如违反上述规则，老师和小助手有权利对成员进行轮替，违规者将按弃赛处理，同时失去补充人员资格。</p>
                    
                    <div>
                      <p className="text-sm font-semibold text-challenge-yellow">声明:</p>
                      <p className="text-sm ml-4 mb-1">挑战赛是作为社群福利，接受所有社群成员的监督和建议，若群友发现违规挑战者，可向小助手反馈。</p>
                      <p className="text-sm ml-4">本活动解释权归 「琦玉Saitama 」所有，如有赛制更新，请随时关注我们的公告。</p>
                    </div>
                    
                    <Popover.Close className="absolute top-2 right-2 text-gray-400 hover:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Popover.Close>
                    <Popover.Arrow className="fill-challenge-yellow" />
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>

            <div className="flex justify-between w-[114px] h-[44px] mt-[18px]">
              {/* 添加点击事件打开Twitter */}
              <img 
                className="w-[44px] h-[44px] cursor-pointer" 
                src="/assets/lanhu/twitter-icon.png" 
                alt="Twitter" 
                onClick={handleTwitterClick}
              />
              {/* 添加点击事件打开Telegram */}
              <img 
                className="w-[40px] h-[40px] mt-[2px] cursor-pointer" 
                src="/assets/lanhu/telegram-icon.png" 
                alt="Telegram" 
                onClick={handleTelegramClick}
              />
            </div>
          </div>
          
          <div className="flex justify-center mt-[49px]">
            <img className="w-[90%] h-[1px]" src="/assets/lanhu/divider.png" alt="分隔线" />
          </div>
          


          {/* 排行榜 - 水平双列布局 */}
          {/* <div className="leaderboard-container flex flex-row justify-center flex-wrap gap-8 py-10">
            <ChallengeGroup 
              title="内敛niko挑战组(1期)" 
              data={mockData1} 
              style={{
                backgroundImage: "url(https://lanhu-oss-2537-2.lanhuapp.com/SketchPng63586989f94b144246fc88d7c97e98f372e966147137f76cdef11f46b833da4c)", 
                backgroundSize: "100% 100%", 
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                paddingBottom: "20px"
              }} 
            />
            <ChallengeGroup 
              title="早起琦玉挑战组(第1期)" 
              data={mockData2} 
              style={{
                backgroundImage: "url(https://lanhu-oss-2537-2.lanhuapp.com/SketchPng46abbc9f4dcb8ea6901657ce04221eb9f56d893b3e82de39dc8f79d3b4c41673)", 
                backgroundSize: "100% 100%", 
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                paddingBottom: "20px"
              }}
            />
          </div> */}

          {/* 排行榜 - 水平双列布局 */}
          <div className="leaderboard-container flex flex-row justify-center flex-wrap gap-8 py-10">
            <ChallengeGroup 
              title="内敛niko挑战组(1期)" 
              data={mockData1} 
              style={{
                backgroundImage: "url(/assets/lanhu/leaderboard-bg.png)", 
                backgroundSize: "100% 100%", 
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                paddingBottom: "20px"
              }} 
            />
            
            <ChallengeGroup 
              title="早起琦玉挑战组(第1期)" 
              data={mockData2} 
              style={{
                backgroundImage: "url(/assets/lanhu/leaderboard-bg.png)", 
                backgroundSize: "100% 100%", 
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                paddingBottom: "20px"
              }}
            />
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;
