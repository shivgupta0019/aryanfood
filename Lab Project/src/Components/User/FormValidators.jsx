// Signup Form Validator

export default function FormValidators(e) {
    const { name, value } = e.target

    switch (name) {

        case "name":
            if (!value) return "Name Field is Mandatory"
            if (value.length < 3) return "Name must be at least 3 characters"
            return ""

        case "username":
            if (!value) return "User Name Field is Mandatory"
            if (value.length < 4) return "Username must be at least 4 characters"
            return ""

        case "email":
            if (!value) return "Email Address Field is Mandatory"
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailPattern.test(value)) return "Invalid Email Address"
            return ""

        case "phone":
            if (!value) return "Phone Number Field is Mandatory"
            const phonePattern = /^[0-9]{10}$/
            if (!phonePattern.test(value)) return "Phone must be 10 digits"
            return ""

        case "password":
            if (!value) return "Password Field is Mandatory"
            if (value.length < 6) return "Password must be at least 6 characters"
            return ""

        case "cpassword":
            if (!value) return "Confirm Password is Mandatory"
            return ""

        default:
            return ""
    }
}