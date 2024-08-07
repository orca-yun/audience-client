import React from 'react'
import inExistent from "@/assets/404.svg"
function NotFound () {
  return (
    <div className="not-found">
      <div><img src={inExistent} alt="" style={{ width: 300 }} /></div>
      <h4>抱歉！该页面不存在</h4>
    </div>
  )
}

export default NotFound