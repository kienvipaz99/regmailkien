const TitleBar = (): JSX.Element => {
  return (
    <nav style={{ '-webkit-app-region': 'drag' } as never}>
      <div className="shadow-sm">
        <div className="relative bg-gray-100 flex w-full items-center h-6 dark:bg-black"></div>
      </div>
    </nav>
  )
}

export default TitleBar
