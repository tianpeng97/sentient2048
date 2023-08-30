import React from 'react'

const Article = ({ title, content, alt }) => {
  return (
    <>
      <div
        className={
          alt ? 'alt-background px-6 pt-6 pb-6 text-slate-50' : 'px-6 pt-6 pb-6'
        }
      >
        <h3 className="text-3xl font-bold">{title}</h3>
      </div>
      <div className={alt ? 'alt-background pb-6 text-slate-50' : 'pb-6'}>
        {content}
      </div>
    </>
  )
}

export default Article
