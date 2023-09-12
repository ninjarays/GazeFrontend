import React from 'react'
import './Card.css'

const Card = ({
  imgSrc,
  imgAlt,
  title,
  buttonText,

 }) => {
  return (
    
    <div className="card-container">
    {imgSrc && imgAlt && (
      <img src={imgSrc} alt={imgAlt} className="card-img" />
    )}
    {title && <h1 className="card-title">{title}</h1>}
    
    {buttonText && (
      <a className="btn" href="https://www.google.com/search?q=react&rlz=1C1CHBF_enIN1038IN1038&oq=react&aqs=chrome.0.0i131i433i512l5j69i61l3.1541j0j9&sourceid=chrome&ie=UTF-8" >
        {buttonText}
      </a>
    )}
  </div>
    
  );
}

export default Card;