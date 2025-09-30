import { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BackgroundImage from "@/assets/bg.jpg";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

interface LoginResponse {
  access_token: string;
  token_type: string;
  role: string;
}

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validasi input (Kode sudah benar)
  const validate = () => {
    let newErrors = { email: "", password: "" };
    let isValid = true;

    if (!form.email.includes("@")) {
      newErrors.email = "Email harus mengandung karakter @.";
      isValid = false;
    } else if (!form.email.endsWith("@gmail.com")) {
      newErrors.email = "Email harus diakhiri dengan '@gmail.com'.";
      isValid = false;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}[\]|:;"'<>,.?/~`-])[A-Za-z\d!@#$%^&*()_+={}[\]|:;"'<>,.?/~`]{8,}$/;

    if (form.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter.";
      isValid = false;
    } else if (!passwordRegex.test(form.password)) {
      newErrors.password =
        "Password harus memiliki min. 1 huruf besar, 1 angka, dan 1 karakter khusus.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle perubahan input
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (errors[e.target.name as "email" | "password"]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Login gagal, periksa email/password");
      }

      const data: LoginResponse = await res.json();
      // Simpan token & role ke localStorage
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);

      alert(`Login berhasil sebagai ${data.role}`);

      // Redirect ke dashboard sesuai role
      window.location.href = data.role === "admin" ? "/dashboard" : "/";
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-40 z-20"></div>

      <Button
        className="absolute top-4 left-4 bg-transparent hover:bg-white/20 z-30 size-16 rounded-md"
        onClick={() => window.history.back()}
        aria-label="Kembali"
      >
        <ArrowLeft className="!h-8 !w-8 text-white" />
      </Button>

      <div className="bg-white/90 shadow-lg rounded-md p-8 w-full max-w-md relative z-40">
        <img
          className="h-24 w-auto mx-auto"
          src="/vector.svg"
          alt="logo classify"
        />
        <h1 className="text-3xl text-center mt-8">
          Welcome to <span className="font-bold">Classify</span>
        </h1>
        <p className="text-center my-2">Login to book the room</p>
        <h2 className="text-2xl font-bold m-6 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EMAIL */}
          <div>
            <Input
              type="text"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={`
                h-10 border focus-visible:ring-blue-400 focus-visible:ring-2 focus-visible:border-blue-500
                ${
                  errors.email
                    ? "!border-red-500 !ring-red-500 !ring-2 !border-2"
                    : ""
                }
              `}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={`
                h-10 border pr-10 focus-visible:ring-blue-400 focus-visible:ring-2 focus-visible:border-blue-500
                ${
                  errors.password
                    ? "!border-red-500 !ring-red-500 !ring-2 !border-2"
                    : ""
                }
              `}
            />

            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? "Sembunyikan password" : "Tampilkan password"
              }
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}

          <p className="text-blue-400 cursor-pointer hover:text-blue-600">
            forgot password ?
          </p>

          {/* Tombol Login */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 text-white font-bold hover:bg-cyan-800"
          >
            {loading ? "Loading..." : "Login"}
          </Button>

          {/* Tombol "Continue with Google" */}
          <Button
            type="button"
            className="w-full border border-gray-300 text-gray-700 font-semibold bg-transparent hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="100"
              height="100"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            Continue with Google
          </Button>

          {/* Register Link */}
          <div className="pt-2 text-center text-sm">
            Haven't an account?
            <a
              href="/register"
              className="text-cyan-600 font-bold hover:text-cyan-800 ml-1"
            >
              Register here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
