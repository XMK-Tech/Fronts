import React, {useState} from 'react'
import {propTypes} from 'react-bootstrap-v5/lib/esm/Image'

export default function Acordion(props: any) {
  const [showList, setShoeList] = useState(false)
  const openClose = () => {
    setShoeList(!showList)
  }
  return (
    <>
      <div className='m-0'>
        <div
          className='d-flex align-items-center collapsible py-3 toggle mb-0 active'
          data-bs-toggle='collapse'
          data-bs-target='#kt_support_2_4'
          aria-expanded='true'
        >
          <div className='ms-n1 me-5'>
            {showList ? (
              <span
                onClick={openClose}
                className='svg-icon toggle-on svg-icon-primary svg-icon-2 cursor-pointer'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                >
                  <path
                    d='M11.4343 12.7344L7.25 8.55005C6.83579 8.13583 6.16421 8.13584 5.75 8.55005C5.33579 8.96426 5.33579 9.63583 5.75 10.05L11.2929 15.5929C11.6834 15.9835 12.3166 15.9835 12.7071 15.5929L18.25 10.05C18.6642 9.63584 18.6642 8.96426 18.25 8.55005C17.8358 8.13584 17.1642 8.13584 16.75 8.55005L12.5657 12.7344C12.2533 13.0468 11.7467 13.0468 11.4343 12.7344Z'
                    fill='black'
                  ></path>
                </svg>
              </span>
            ) : (
              <span onClick={openClose} className='svg-icon svg-icon-2 cursor-pointer'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                >
                  <path
                    d='M12.6343 12.5657L8.45001 16.75C8.0358 17.1642 8.0358 17.8358 8.45001 18.25C8.86423 18.6642 9.5358 18.6642 9.95001 18.25L15.4929 12.7071C15.8834 12.3166 15.8834 11.6834 15.4929 11.2929L9.95001 5.75C9.5358 5.33579 8.86423 5.33579 8.45001 5.75C8.0358 6.16421 8.0358 6.83579 8.45001 7.25L12.6343 11.4343C12.9467 11.7467 12.9467 12.2533 12.6343 12.5657Z'
                    fill='black'
                  ></path>
                </svg>
              </span>
            )}
          </div>

          <div onClick={openClose} className='d-flex align-items-center flex-wrap cursor-pointer'>
            <span className='text-dark fw-bolder d-block'>{props.title}</span>
          </div>
        </div>
        {showList ? (
          <div id='kt_support_2_4' className='fs-6 ms-10 collapse show'>
            <div className='mb-4'>
              <span className='text-muted fw-bold fs-5'>
                By Keenthemes to save tons and more to time money projects are listed and
                outstanding Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam ea
                maxime dolorem sit commodi, odio voluptates dignissimos sapiente pariatur atque aut
                neque itaque ipsa, veniam quasi ratione exercitationem! Culpa, tenetur? Lorem ipsum
                dolor sit amet consectetur, adipisicing elit. Voluptate harum nostrum itaque
                molestias natus neque excepturi dolorum aut ab quaerat, amet exercitationem quas ut
                quisquam, at dolore dicta quam. Eaque!
              </span>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    </>
  )
}
