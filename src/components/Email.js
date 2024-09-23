import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const EmailForm = () => {
  const [formData, setFormData] = useState({
    from_name: '',
    to_name: '',
    message: '',
    reply_to: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      from_name: formData.from_name,
      to_name: formData.to_name,
      message: formData.message,
      reply_to: formData.reply_to
    };

    emailjs.send('service_eri6sdi', 'template_zfwkubt', templateParams, 'WmGu5zx-HXjrvTMxJ')
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
        alert('Email sent successfully!');
        setFormData({
          from_name: '',
          to_name: '',
          message: '',
          reply_to: ''
        });
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
        alert('Failed to send email. Please try again later.');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="from_name">From Name</label>
        <input
          type="text"
          id="from_name"
          name="from_name"
          value={formData.from_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="to_name">To Name</label>
        <input
          type="text"
          id="to_name"
          name="to_name"
          value={formData.to_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="reply_to">Reply To</label>
        <input
          type="email"
          id="reply_to"
          name="reply_to"
          value={formData.reply_to}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
      </div>
      <button type="submit">Send Email</button>
    </form>
  );
};

export default EmailForm;
