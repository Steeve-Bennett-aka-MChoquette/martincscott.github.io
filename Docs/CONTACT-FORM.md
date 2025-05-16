# Contact Form Documentation

This document provides detailed information about the contact form implementation in the Martin C Scott website.

## Overview

The website includes a contact form that allows visitors to send messages directly from the website. The form uses EmailJS for serverless email delivery and Cloudflare Turnstile for spam protection.

## Technologies Used

- **EmailJS**: A service that allows sending emails directly from client-side JavaScript without a backend server
- **Cloudflare Turnstile**: A CAPTCHA alternative that provides spam protection with a better user experience
- **HTML5 Form Validation**: Native browser validation for form fields
- **Custom JavaScript**: For form submission handling and validation

## Implementation

The contact form is implemented in `src/components/contactform.astro`.

### Component Structure

The component consists of:

1. **Form Fields**: Name, email, and message inputs
2. **Validation Feedback**: Error messages for invalid inputs
3. **Turnstile Widget**: Spam protection
4. **Submit Button**: For form submission
5. **Result Display**: Shows success or error messages

### HTML Structure

```astro
<form
 id="form"
 class="needs-validation"
 novalidate>
 <div class="mb-5">
   <input
     type="text"
     placeholder="Full Name"
     required
     class="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
     name="from_name"
   />
   <div class="empty-feedback invalid-feedback text-red-400 text-sm mt-1">
     Please provide your full name.
   </div>
 </div>
 <div class="mb-5">
   <label for="email_address" class="sr-only">Email Address</label>
   <input
     id="email_address"
     type="email"
     placeholder="Email Address"
     name="reply_to"
     required
     class="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
   />
   <div class="empty-feedback text-red-400 text-sm mt-1">
     Please provide your email address.
   </div>
   <div class="invalid-feedback text-red-400 text-sm mt-1">
     Please provide a valid email address.
   </div>
 </div>
 <div class="mb-3">
   <textarea
     name="message"
     required
     placeholder="Your Message"
     class="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none h-36 focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
   ></textarea>
   <div class="empty-feedback invalid-feedback text-red-400 text-sm mt-1">
     Please enter your message.
   </div>
 </div>
 
 <!-- Turnstile Widget -->
 <div class="mb-5">
   <div id="cf-turnstile" class="mb-3"></div>
 </div>

 <Button type="submit" size="lg" block>Send Message</Button>
 <div id="result" class="mt-3 text-center"></div>
</form>
```

### CSS Styling

The form includes custom CSS for validation states with dark mode support:

```css
.invalid-feedback,
.empty-feedback {
  display: none;
}
.was-validated :placeholder-shown:invalid ~ .empty-feedback {
  display: block;
}
.was-validated :not(:placeholder-shown):invalid ~ .invalid-feedback {
  display: block;
}
.is-invalid,
.was-validated :invalid {
  border-color: #dc3545;
}

/* Dark mode validation */
.dark .is-invalid,
.dark .was-validated :invalid {
  border-color: #ef4444; /* red-400 for better dark mode contrast */
}
.dark .text-red-500 {
  color: #f87171; /* red-300 for better visibility */
}
.dark .text-green-500 {
  color: #4ade80; /* green-400 for better visibility */
}
```

### EmailJS Integration

The form uses EmailJS for sending emails:

```html
<!-- EmailJS SDK -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

<!-- Initialize EmailJS -->
<script is:inline define:vars={{ emailJsKey }}>
 (function() {
   emailjs.init(emailJsKey);
 })();
</script>
```

### Cloudflare Turnstile Integration

Turnstile is integrated for spam protection:

```html
<!-- Turnstile -->
<script define:vars={{ turnstileKey }}>
  if (typeof window !== 'undefined') {
    window.onloadTurnstileCallback = function () {
      turnstile.render('#cf-turnstile', {
        sitekey: turnstileKey,
        callback: function(token) {
          console.log('Turnstile success:', token);
          window.turnstileToken = token;
        }
      });
    };
  }
</script>

<script async
  src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback">
</script>
```

### Form Submission Logic

The form submission is handled by JavaScript:

```javascript
document.addEventListener('DOMContentLoaded', function() {
  try {
    let form = document.getElementById("form");
    let result = document.getElementById("result");

    if (!form || !result) {
      console.error('Form or result element not found');
      return;
    }

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      form.classList.add("was-validated");

      // Remove any existing error messages
      result.classList.remove("text-red-500", "text-green-500");
      result.innerHTML = "";

      if (!form.checkValidity()) {
        // Show the first validation error
        const firstInvalid = form.querySelectorAll(":invalid")[0];
        if (firstInvalid) {
          const invalidInput = firstInvalid.querySelector("input, textarea");
          if (invalidInput) invalidInput.focus();
          else firstInvalid.focus();
          
          // Show error message
          const errorDiv = firstInvalid.querySelector(".invalid-feedback, .empty-feedback");
          if (errorDiv) {
            errorDiv.style.display = "block";
          }
        }
        return;
      }

      // Check if turnstile is available
      if (typeof window.turnstileToken === 'undefined') {
        console.warn('Turnstile token not found. This might be due to Turnstile not loading properly.');
        // Continue anyway for build process
      } else if (!window.turnstileToken) {
        result.classList.add("text-red-500");
        result.innerHTML = "Please complete the captcha";
        return;
      }

      try {
        // Clear all error messages
        document.querySelectorAll(".invalid-feedback, .empty-feedback").forEach(el => {
          el.style.display = "none";
        });
        
        result.innerHTML = "Sending...";
        result.setAttribute("aria-busy", "true");

        // Check if EmailJS is available
        if (typeof emailjs === 'undefined') {
          throw new Error('EmailJS not loaded');
        }

        const templateParams = {
          from_name: form.from_name.value,
          reply_to: form.reply_to.value,
          message: form.message.value,
          'cf-turnstile-response': window.turnstileToken || 'not-available'
        };

        const response = await emailjs.send(
          emailJsServiceId,
          emailJsTemplateId,
          templateParams,
          emailJsKey
        );

        console.log('SUCCESS!', response.status, response.text);
        result.classList.remove("text-red-500");
        result.classList.add("text-green-500");
        result.innerHTML = "Message sent successfully!";
        
        // Reset form and captcha
        form.reset();
        form.classList.remove("was-validated");
        
        // Reset turnstile if available
        if (typeof turnstile !== 'undefined') {
          turnstile.reset();
        }
        window.turnstileToken = null;

        // Clear success message after 5 seconds
        setTimeout(() => {
          result.style.display = "none";
        }, 5000);
        
        // Remove aria-busy attribute
        result.removeAttribute("aria-busy");

      } catch(error) {
        console.error('FAILED...', error);
        result.classList.add("text-red-500");
        result.innerHTML = "Failed to send: " + (error.text || error.message || 'Unknown error');
        result.removeAttribute("aria-busy");
      }
    });
  } catch (error) {
    console.error('Error setting up form handler:', error);
  }
});
```

## Environment Variables

The contact form requires several environment variables:

```
PUBLIC_EMAILJS_KEY=your_key_here
PUBLIC_EMAILJS_SERVICE_ID=your_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
PUBLIC_TURNSTILE_KEY=your_turnstile_key
```

These are loaded in the component:

```javascript
// Get environment variables in the component script
const emailJsKey = import.meta.env.PUBLIC_EMAILJS_KEY;
const emailJsServiceId = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID;
const emailJsTemplateId = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID;
const turnstileKey = import.meta.env.PUBLIC_TURNSTILE_KEY;
```

## Setting Up EmailJS

To set up EmailJS for the contact form:

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Create a new email service (e.g., Gmail, Outlook, etc.)
3. Create an email template with the following variables:
   - `from_name`: The name of the person sending the message
   - `reply_to`: The email address of the person sending the message
   - `message`: The content of the message
4. Get your EmailJS public key, service ID, and template ID
5. Add these values to your `.env` file:
   ```
   PUBLIC_EMAILJS_KEY=your_key_here
   PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   ```

## Setting Up Cloudflare Turnstile

To set up Cloudflare Turnstile for spam protection:

1. Create an account at [Cloudflare](https://www.cloudflare.com/)
2. Navigate to the Turnstile section
3. Create a new site
4. Choose the "Invisible" widget type for the best user experience
5. Get your site key
6. Add this value to your `.env` file:
   ```
   PUBLIC_TURNSTILE_KEY=your_turnstile_key
   ```

## Form Validation

The form uses both HTML5 validation and custom JavaScript validation:

1. **HTML5 Validation**:
   - `required` attribute on inputs
   - `type="email"` for email validation

2. **Custom Validation**:
   - Checks if the form is valid using `form.checkValidity()`
   - Focuses on the first invalid input
   - Verifies that the Turnstile token is present

## Success and Error Handling

The form provides feedback to the user:

1. **Success Feedback**:
   - Displays a success message
   - Resets the form
   - Resets the Turnstile widget
   - Clears the success message after 5 seconds

2. **Error Feedback**:
   - Displays an error message with details
   - Logs the error to the console

## Customization

### Changing Form Fields

To add or modify form fields:

1. Add the new input to the HTML structure
2. Add validation feedback if required
3. Update the `templateParams` object in the submission logic to include the new field

Example of adding a "Subject" field:

```astro
<div class="mb-5">
  <input
    type="text"
    placeholder="Subject"
    required
    class="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
    name="subject"
  />
  <div class="empty-feedback invalid-feedback text-red-400 text-sm mt-1">
    Please provide a subject.
  </div>
</div>
```

And update the submission logic:

```javascript
const templateParams = {
  from_name: form.from_name.value,
  reply_to: form.reply_to.value,
  subject: form.subject.value,  // Add the new field
  message: form.message.value,
  'cf-turnstile-response': window.turnstileToken
};
```

### Changing Email Template

To modify the email template:

1. Log in to your EmailJS account
2. Navigate to the email template
3. Update the template with your desired layout
4. Make sure to include the variables used in the `templateParams` object

### Styling the Form

The form uses Tailwind CSS classes for styling. To modify the appearance:

1. Update the classes on the form elements
2. Add custom CSS in the `<style>` section if needed

Example of changing the button color:

```astro
<Button type="submit" size="lg" block class="bg-blue-500 hover:bg-blue-600">Send Message</Button>
```

## Testing the Form

To test the contact form:

1. Ensure all environment variables are set
2. Run the development server: `npm run dev`
3. Navigate to the contact page
4. Fill out the form and submit
5. Check your email to verify that the message was received
6. Test validation by submitting an incomplete form
7. Test error handling by temporarily using invalid EmailJS credentials

## Security Considerations

The contact form includes several security measures:

1. **Cloudflare Turnstile**: Prevents spam submissions
2. **Client-side Validation**: Ensures data integrity
3. **Environment Variables**: Keeps sensitive information secure
4. **EmailJS**: Handles email sending securely without exposing server details

## Troubleshooting

### Form Submission Fails

If the form submission fails:

1. Check the browser console for error messages
2. Verify that all environment variables are correctly set
3. Ensure that the EmailJS service and template are properly configured
4. Check that the Turnstile widget is rendering correctly

### Emails Not Received

If emails are not being received:

1. Check your spam folder
2. Verify that the EmailJS service is working correctly
3. Check the EmailJS dashboard for any error messages
4. Ensure that the email template is correctly configured

### Turnstile Widget Not Appearing

If the Turnstile widget is not appearing:

1. Check that the Turnstile key is correctly set
2. Verify that the Turnstile script is loading (check browser network tab)
3. Ensure that there are no JavaScript errors preventing the widget from rendering

## Performance Optimization

To optimize the contact form performance:

1. **Lazy Loading**: The Turnstile script is loaded with the `async` attribute
2. **Minimal Dependencies**: The form uses minimal external dependencies
3. **Efficient Validation**: Uses native HTML5 validation where possible
4. **Optimized Feedback**: Provides immediate feedback to the user

## Accessibility

The contact form includes several accessibility features:

1. **Screen Reader Support**: Uses `sr-only` labels for screen readers
2. **Keyboard Navigation**: All form elements are keyboard accessible
3. **Focus Management**: Sets focus on the first invalid field
4. **Error Messages**: Provides clear error messages for validation failures

## Future Enhancements

Potential improvements to the contact form:

1. **File Attachments**: Allow users to attach files to their messages
2. **Form Analytics**: Track form submissions and success rates
3. **Auto-response**: Send an automatic response to the user
4. **Form Persistence**: Save form data in localStorage to prevent data loss
5. **Progressive Enhancement**: Improve the experience for users with JavaScript disabled
