import { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BackgroundImage from "@/assets/bg.jpg";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let newErrors = { name: "", email: "", password: "", confirmPassword: "" };
    let isValid = true;

    if (form.name.trim().length < 2) {
      newErrors.name = "Nama minimal 2 karakter.";
      isValid = false;
    }

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

    if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Konfirmasi password tidak cocok.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      console.log("Validasi Registrasi Gagal.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      if (response.status === 409) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Email sudah terdaftar.");
      }

      if (!response.ok) {
        throw new Error("Registrasi gagal. Silakan coba lagi.");
      }

      await response.json();
      alert("Registrasi berhasil! Silakan login dengan akun Anda.");
      window.location.href = "/login";

    } catch (error: any) {
      alert(error.message || "Terjadi kesalahan saat registrasi.");
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
        <img className="h-24 w-auto mx-auto" src="/vector.svg" alt="logo classify" />
        <h1 className="text-3xl text-center mt-8">
          Welcome to <span className="font-bold">Classify</span>
        </h1>
        <p className="text-center">Create your account here</p>
        <h2 className="text-2xl font-bold m-6 text-center">Register your account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          <div>
            <Input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className={`
                h-10 border focus-visible:ring-blue-400 focus-visible:ring-2 focus-visible:border-blue-500
                ${errors.name ? "!border-red-500 !ring-red-500 !ring-2 !border-2" : ""}
              `}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

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
                ${errors.email ? "!border-red-500 !ring-red-500 !ring-2 !border-2" : ""}
              `}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <div className="relative flex items-center">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className={`
                  h-10 border pr-10 focus-visible:ring-blue-400 focus-visible:ring-2 focus-visible:border-blue-500
                  ${errors.password ? "!border-red-500 !ring-red-500 !ring-2 !border-2" : ""}
                `}
              />
              <button
                type="button"
                className="absolute right-3 text-gray-500 hover:text-gray-700 flex items-center justify-center"
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
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <div className="relative flex items-center">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className={`
                  h-10 border pr-10 focus-visible:ring-blue-400 focus-visible:ring-2 focus-visible:border-blue-500
                  ${errors.confirmPassword ? "!border-red-500 !ring-red-500 !ring-2 !border-2" : ""}
                `}
              />
              <button
                type="button"
                className="absolute right-3 text-gray-500 hover:text-gray-700 flex items-center justify-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword
                    ? "Sembunyikan konfirmasi password"
                    : "Tampilkan konfirmasi password"
                }
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 text-white font-bold hover:bg-cyan-800 mt-6"
          >
            {loading ? "Registering..." : "Register Account"}
          </Button>

          <div className="pt-2 text-center text-sm">
            Already have an account?
            <a
              href="/login"
              className="text-cyan-600 font-bold hover:text-cyan-800 ml-1"
            >
              Login here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
