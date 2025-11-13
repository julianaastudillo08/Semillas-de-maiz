const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue', onClick }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    yellow: 'from-yellow-500 to-yellow-600'
  }

  const textColors = {
    blue: 'text-blue-100',
    green: 'text-green-100',
    purple: 'text-purple-100',
    orange: 'text-orange-100',
    red: 'text-red-100',
    yellow: 'text-yellow-100'
  }

  const iconColors = {
    blue: 'text-blue-200',
    green: 'text-green-200',
    purple: 'text-purple-200',
    orange: 'text-orange-200',
    red: 'text-red-200',
    yellow: 'text-yellow-200'
  }

  const CardContent = () => (
    <div className={`card bg-gradient-to-br ${colors[color]} text-white ${onClick ? 'cursor-pointer' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`${textColors[color]} text-sm mb-1`}>{title}</p>
          <p className="text-4xl font-bold">{value}</p>
          {subtitle && <p className={`${textColors[color]} text-xs mt-1`}>{subtitle}</p>}
        </div>
        {Icon && <Icon size={48} className={iconColors[color]} />}
      </div>
    </div>
  )

  return onClick ? (
    <div onClick={onClick} className="hover:shadow-xl transition">
      <CardContent />
    </div>
  ) : (
    <CardContent />
  )
}

export default StatCard

