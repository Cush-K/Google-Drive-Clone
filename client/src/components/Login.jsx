import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from 'yup';
import { useAuth } from "./AuthContext"; 
import useStore from "./Store";

function Login() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { setUser } = useAuth(); 
    const { setFiles, setFolders, setCurrentFolderId } = useStore();

    const loginSchema = yup.object().shape({
        email: yup.string().email("Invalid email format").required('Email is required'),
        password: yup.string().required('Password is required') // Changed 'Username' to 'Password'
    });

    const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, isValid, dirty } = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: loginSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await fetch(`/api/login`, {
                    method: "POST",
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(values)
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                    const [foldersResponse, filesResponse] = await Promise.all([
                        fetch("/api/folders", {
                            credentials: "include",
                        }),
                        fetch("/api/files", {
                            credentials: "include",
                        }),
                    ]);

                    if (foldersResponse.ok && filesResponse.ok) {
                        const folders = await foldersResponse.json();
                        const files = await filesResponse.json();

                        // Save data to the global store
                        setFolders(folders);
                        setFiles(files);
                        setCurrentFolderId(null); // Optional: Set root folder as the default
                    }

                    setMessage("Login Successful");
                    navigate("/home");
                } else {
                    const errorData = await response.json(); 
                    setMessage(errorData.error || "Invalid email or password"); 
                }
            } catch (error) {
                setMessage("An error occurred during login");
            } finally {
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <>
            <div className="login-container">
                <div className="login">
                  <Link to="/home">
                  <img src="google.svg" alt="login"/>
                  </Link>
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.email && touched.email ? "inputError" : ""}
                        />
                        {errors.email && touched.email && <p className="errors">{errors.email}</p>}

                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.password && touched.password ? "inputError" : ""}
                        />
                        {errors.password && touched.password && <p className="errors">{errors.password}</p>}

                        <button type="submit" disabled={!dirty || !isValid || isSubmitting || loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {message && <p className="responseMessage">{message}</p>}

                    <p>
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Login;
