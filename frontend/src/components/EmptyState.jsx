const EmptyState = ({ icon: Icon, title, message, action }) => {
  return (
    <div className="card text-center py-16">
      {Icon && <Icon size={80} className="mx-auto text-gray-300 mb-4" />}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      {action}
    </div>
  )
}

export default EmptyState

