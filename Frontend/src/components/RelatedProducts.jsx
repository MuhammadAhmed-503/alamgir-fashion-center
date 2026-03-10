import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useTheme } from '../context/ThemeContext'
import Title from './Title'
import ProductItem from './ProductItem'

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext)
  const { isDarkMode } = useTheme()
  const [related, setRelated] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice()
      
      productsCopy = productsCopy.filter((item) => category === item.category)
      productsCopy = productsCopy.filter((item) => subCategory === item.subCategory)
      
      setRelated(productsCopy.slice(0, 5))
    }
  }, [products, category, subCategory])

  if (related.length === 0) return null;

  return (
    <div className='my-16'>
      <div className='text-center mb-8'>
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
        <p className={`mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          You might also like these
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6'>
        {related.map((item, index) => (
          <div key={index} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
            <ProductItem 
              id={item._id} 
              name={item.name} 
              price={item.price} 
              image={item.image}
              colors={item.colors}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts
