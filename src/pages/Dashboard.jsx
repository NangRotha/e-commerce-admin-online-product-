// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { FaBox, FaShoppingBag, FaUsers, FaDollarSign, FaSpinner, FaBell, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    recentOrders: [],
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    fetchDashboardData();
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('km-KH', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    }));
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsData = await api.get('/admin/dashboard/stats');
      setStats({
        totalProducts: statsData?.totalProducts || 0,
        totalOrders: statsData?.totalOrders || 0,
        totalRevenue: statsData?.totalRevenue || 0,
        totalUsers: statsData?.totalUsers || 0,
        recentOrders: statsData?.recentOrders || [],
      });
      
      const chartDataRes = await api.get('/admin/dashboard/chart-data');
      setChartData(Array.isArray(chartDataRes) ? chartDataRes : []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats({ totalProducts: 0, totalOrders: 0, totalRevenue: 0, totalUsers: 0, recentOrders: [] });
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'ផលិតផលសរុប', value: stats.totalProducts || 0, icon: FaBox, color: 'bg-blue-500 text-white', bgLight: 'bg-blue-50' },
    { title: 'ការបញ្ជាទិញសរុប', value: stats.totalOrders || 0, icon: FaShoppingBag, color: 'bg-green-500 text-white', bgLight: 'bg-green-50' },
    { title: 'ចំណូលសរុប', value: `$${(stats.totalRevenue || 0).toFixed(2)}`, icon: FaDollarSign, color: 'bg-yellow-500 text-white', bgLight: 'bg-yellow-50' },
    { title: 'អតិថិជនសរុប', value: stats.totalUsers || 0, icon: FaUsers, color: 'bg-purple-500 text-white', bgLight: 'bg-purple-50' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Skeleton Loader UI (ពេលកំពុងផ្ទុកទិន្នន័យ)
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-pulse">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-gray-200 rounded-3xl h-48 w-full"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="bg-gray-200 rounded-2xl h-24 w-full"></div>)}
          </div>
          <div className="bg-gray-200 rounded-3xl h-64 w-full"></div>
          <div className="bg-gray-200 rounded-3xl h-80 w-full"></div>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-200 rounded-3xl h-64 w-full"></div>
          <div className="bg-gray-200 rounded-3xl h-64 w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* ===== Left Column (Col-span 3) ===== */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        
        {/* ===== Welcome Banner ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-white relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          
          <div className="relative z-10 flex justify-between items-start flex-wrap gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                សូមស្វាគមន៍វិញ, Admin!
              </h2>
              <p className="text-gray-500 mt-2 max-w-lg text-sm md:text-base">
                នេះគឺជាទិដ្ឋភាពទូទៅនៃស្ថានភាពហាងរបស់អ្នក។
              </p>
              <button className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg">
                មើលបន្ថែម
              </button>
            </div>
            <div className="hidden md:block text-right text-sm text-gray-500 bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm">
              <p>{currentDate}</p>
            </div>
          </div>
        </motion.div>

        {/* ===== Stat Cards ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <p className="text-sm text-gray-500 font-medium mb-2">{stat.title}</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <div className={`${stat.color} p-2.5 rounded-xl shadow-sm`}>
                  <stat.icon className="text-lg" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ===== Chart Section ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">និន្នាការចំណូល និងការបញ្ជាទិញ</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium bg-indigo-50 px-4 py-1.5 rounded-full hover:bg-indigo-100 transition-colors">
              មើលទាំងអស់ →
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartData && chartData.length > 0 ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} dy={10} />
                  <YAxis yAxisId="left" stroke="#9ca3af" axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#4f46e5" 
                    strokeWidth={3}
                    name="ចំណូល ($)"
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    name="ការបញ្ជាទិញ"
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </LineChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 flex-col gap-2">
                  <FaSpinner className="text-4xl text-indigo-300 animate-spin" />
                  <span className="text-sm">កំពុងផ្ទុកទិន្នន័យក្រាហ្វ...</span>
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ===== Recent Orders ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">ការបញ្ជាទិញថ្មីៗ</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium bg-indigo-50 px-4 py-1.5 rounded-full hover:bg-indigo-100 transition-colors">
              មើលទាំងអស់ →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">លេខបញ្ជាទិញ</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">អតិថិជន</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ចំនួន</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ស្ថានភាព</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">កាលបរិច្ឆេទ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentOrders && stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium text-gray-800">#{order.order_number}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{order.user?.full_name || 'ភ្ញៀវ'}</td>
                      <td className="py-3 px-4 text-sm font-medium text-indigo-600">${order.total_amount?.toFixed(2) || '0.00'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 text-xs rounded-full font-semibold shadow-sm ${getStatusColor(order.status)}`}>
                          {order.status === 'pending' ? 'រង់ចាំ' :
                           order.status === 'processing' ? 'កំពុងដំណើរការ' :
                           order.status === 'shipped' ? 'បានដឹកជញ្ជូន' :
                           order.status === 'delivered' ? 'បានប្រគល់' :
                           order.status === 'cancelled' ? 'បានលុប' : order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-400 text-sm">មិនទាន់មានការបញ្ជាទិញនៅឡើយទេ</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* ===== Right Column (Col-span 1) ===== */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        
        {/* ===== User Profile ===== */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center flex flex-col items-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4 shadow-md border-4 border-white">
            <FaUsers className="text-4xl text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Admin</h3>
          <p className="text-sm text-gray-500 font-medium">អ្នកគ្រប់គ្រង</p>
          <button className="mt-5 px-6 py-2 bg-indigo-50 text-indigo-600 rounded-full font-medium hover:bg-indigo-100 hover:text-indigo-700 transition-colors w-full border border-indigo-100">
            ប្រវត្តិរូប
          </button>
        </motion.div>

        {/* ===== Notifications ===== */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">ការជូនដំណឹង</h3>
            <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
              <FaBell className="text-sm" />
            </div>
          </div>
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 flex-shrink-0">
                <FaCheckCircle className="text-lg" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">ការបញ្ជាទិញថ្មី</p>
                <p className="text-xs text-gray-500 mt-0.5">អតិថិជនម្នាក់បានបញ្ជាទិញថ្មី</p>
                <p className="text-xs text-gray-400 mt-1">២ ម៉ោងមុន</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-500 flex-shrink-0">
                <FaCalendarAlt className="text-lg" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">ផលិតផលថ្មី</p>
                <p className="text-xs text-gray-500 mt-0.5">អ្នកមានផលិតផលថ្មីចំនួន ៥</p>
                <p className="text-xs text-gray-400 mt-1">៥ ម៉ោងមុន</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;