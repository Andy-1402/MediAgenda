function MainContainer({ children, narrow = false }) {
  return (
    <main className="main">
      <div className={'container' + (narrow ? ' main-narrow' : '')}>
        {children}
      </div>
    </main>
  )
}

export default MainContainer
