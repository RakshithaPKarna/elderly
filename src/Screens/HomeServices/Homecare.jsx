
import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import useWebSocket from 'react-use-websocket';
import * as Yup from 'yup';
import axios from 'axios';
import { BiLogoWhatsapp } from 'react-icons/bi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import useSound from 'use-sound';
import './HomeServices.css';
import 'react-toastify/dist/ReactToastify.css';

const HomeServices = () => {
  const services = [
    { name: 'Shopping Assistance', whatsapp: '8448520755', image: '/assets/shopping.jpeg' },
    { name: 'Birthday/Social Organization', whatsapp: '8448520755', image: '/assets/birthday.jpeg' },
    { name: 'Mental Support from NGOs', whatsapp: '9655836135', image: '/assets/mental-support.jpeg' },
    { name: 'Cooking Assistance', whatsapp: '6374783198', image: '/assets/cooking.jpeg' },
    { name: 'Cleaning Assistance', whatsapp: '6374783198', image: '/assets/cleaning.jpeg' },
    { name: 'Home Care Assistance', whatsapp: '7551067902', image: '/assets/home-care.jpeg' },
  ];

  const serviceSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^\d{10}$/, 'Phone number must contain exactly 10 digits'),
    email: Yup.string().email('Invalid email format'),
    description: Yup.string().required('Description is required'),
  });

  // Sound playback setup
  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3000/events');
 
    eventSource.addEventListener('fall-detected', (event) => {
      const data = JSON.parse(event.data);
      toast.error('🚨 Fall detected! Please take action.', {
        position: "center",
        autoClose: false, // The notification will remain until dismissed
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
 
    return () => {
      eventSource.close();
    };
  }, []);

  
  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      description: '',
      email: '',
      selection: '',
      whatsappNumber: '',
    },
    validationSchema: serviceSchema,
    onSubmit: async (values) => {
      try {
        if (!values.whatsappNumber) {
          toast.error("Please select a service first.");
          return;
        }

        console.log("📤 Sending form data:", values);
        const response = await axios.post('http://localhost:3000/api/submitForm', values);

        if (response.status === 200) {
          console.log('✅ Form data sent successfully');
          toast.success("Form submitted successfully!");
          formik.resetForm();
        } else {
          console.error('❌ Failed to send form data');
          toast.error("Submission failed.");
        }
      } catch (error) {
        console.error('❌ Error sending form data:', error);
        toast.error("An error occurred while sending data.");
      }
    },
  });

  const handleServiceClick = (service) => {
    formik.setValues({
      ...formik.values,
      selection: service.name,
      whatsappNumber: `whatsapp:+91${service.whatsapp}`,
    });
  };

  return (
    <div className="Homecareservices">
     <ToastContainer />
           <h1>"For urgent matters, WhatsApp us. Otherwise, use the form."</h1>

      {/* Swiper Carousel for Service List */}
      <Swiper
  modules={[Navigation, Pagination]}
  spaceBetween={10} /* Reduced gap between cards */
  slidesPerView={4} /* Show exactly 4 items at a time */
  centeredSlides={false} /* Prevents unnecessary centering */
  navigation
  pagination={{ clickable: true }}
  breakpoints={{
    320: { slidesPerView: 1 }, /* Mobile - 1 card */
    640: { slidesPerView: 2 }, /* Small screens - 2 cards */
    768: { slidesPerView: 3 }, /* Medium screens - 3 cards */
    1024: { slidesPerView: 4 }, /* Large screens - 4 cards */
  }}
  className="service-carousel"
>



        {services.map((service) => (
          <SwiperSlide key={service.name}>
            <div
              className={`feature-card ${formik.values.selection === service.name ? 'active' : ''}`}
              onClick={() => handleServiceClick(service)}
            >
              <h3>{service.name}</h3>
              <button
                className="whatsapp-button"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`https://wa.me/91${service.whatsapp}`, '_blank');
                }}
              >
                <BiLogoWhatsapp /> Chat
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {formik.values.selection && (
        <div className="service-form">
          <h2>Service Request Form - {formik.values.selection}</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className='form-group'>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && <div className="error">{formik.errors.name}</div>}
            </div>

            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.phone && formik.errors.phone && <div className="error">{formik.errors.phone}</div>}
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email (optional)"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="form-group">
              <textarea
                name="description"
                placeholder="Description of Service Required"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.description && formik.errors.description && <div className="error">{formik.errors.description}</div>}
            </div>

            <button className='btn' type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default HomeServices;