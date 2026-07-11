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
      setStats(statsData);
      
      const chartDataRes = await api.get('/admin/dashboard/chart-data');
      setChartData(chartDataRes);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'ផលិតផលសរុប', value: stats.totalProducts, icon: FaBox, color: 'bg-blue-500/20 text-blue-600' },
    { title: 'ការបញ្ជាទិញសរុប', value: stats.totalOrders, icon: FaShoppingBag, color: 'bg-green-500/20 text-green-600' },
    { title: 'ចំណូលសរុប', value: `$${stats.totalRevenue.toFixed(2)}`, icon: FaDollarSign, color: 'bg-yellow-500/20 text-yellow-600' },
    { title: 'អតិថិជនសរុប', value: stats.totalUsers, icon: FaUsers, color: 'bg-purple-500/20 text-purple-600' },
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

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FaSpinner className="text-4xl text-indigo-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* ===== Main Content (Col-span 3) ===== */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* ===== Welcome Banner ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-100/80 via-purple-100/80 to-pink-100/80 backdrop-blur-sm border border-white/30 rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-indigo-200/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  សូមស្វាគមន៍វិញ, Admin!
                </h2>
                <p className="text-gray-600 mt-2 max-w-lg">
                  នេះគឺជាទិដ្ឋភាពទូទៅនៃស្ថានភាពហាងរបស់អ្នក។ អ្នកកំពុងដំណើរការល្អ!
                </p>
                <button className="mt-4 px-6 py-2 bg-indigo-500/20 backdrop-blur-sm border border-indigo-200/50 text-indigo-700 rounded-full font-medium hover:bg-indigo-500 hover:text-white transition-all duration-300">
                  មើលបន្ថែម
                </button>
              </div>
              <div className="hidden md:block text-right text-sm text-gray-500">
                <p>{currentDate}</p>
              </div>
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
              className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="text-xl" />
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
          className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-3xl p-6 shadow-lg"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">និន្នាការចំណូល និងការបញ្ជាទិញ</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">មើលទាំងអស់ →</button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis yAxisId="left" stroke="#9ca3af" />
                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', border: '1px solid #e5e7eb', borderRadius: '12px' }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#4f46e5" 
                  strokeWidth={2}
                  name="ចំណូល ($)"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="ការបញ្ជាទិញ"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ===== Recent Orders ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-3xl p-6 shadow-lg"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">ការបញ្ជាទិញថ្មីៗ</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">មើលទាំងអស់ →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200/50">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">លេខបញ្ជាទិញ</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">អតិថិជន</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">ចំនួន</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">ស្ថានភាព</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">កាលបរិច្ឆេទ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors duration-300">
                      <td className="py-3 px-4 text-sm font-medium text-gray-800">{order.order_number}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{order.user?.full_name || 'ភ្ញៀវ'}</td>
                      <td className="py-3 px-4 text-sm font-medium text-indigo-600">${order.total_amount.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(order.status)}`}>
                          {order.status === 'pending' ? 'រង់ចាំ' :
                           order.status === 'processing' ? 'កំពុងដំណើរការ' :
                           order.status === 'shipped' ? 'បានដឹកជញ្ជូន' :
                           order.status === 'delivered' ? 'បានប្រគល់' :
                           order.status === 'cancelled' ? 'បានលុប' : order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">មិនទាន់មានការបញ្ជាទិញនៅឡើយទេ</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* ===== Right Panel (Col-span 1) ===== */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* ===== User Profile ===== */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-3xl p-6 shadow-lg text-center"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <FaUsers className="text-4xl text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Admin</h3>
          <p className="text-sm text-gray-500">អ្នកគ្រប់គ្រង</p>
          <button className="mt-4 px-6 py-2 bg-indigo-500/20 backdrop-blur-sm border border-indigo-200/50 text-indigo-700 rounded-full font-medium hover:bg-indigo-500 hover:text-white transition-all duration-300 w-full">
            ប្រវត្តិរូប
          </button>
        </motion.div>

        {/* ===== Calendar / Notifications ===== */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-3xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">ការជូនដំណឹង</h3>
            <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-600">
              <FaBell className="text-sm" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                <FaCheckCircle className="text-sm" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">ការបញ្ជាទិញថ្មី</p>
                <p className="text-xs text-gray-500">អតិថិជនម្នាក់បានបញ្ជាទិញថ្មី</p>
                <p className="text-xs text-gray-400 mt-1">២ ម៉ោងមុន</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                <FaCalendarAlt className="text-sm" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">ផលិតផលថ្មី</p>
                <p className="text-xs text-gray-500">អ្នកមានផលិតផលថ្មីចំនួន ៥</p>
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