/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth";
import Loading from "../../components/Loading";

function SignUp() {
  const { user, register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [signingUp, setSigningUp] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/plans");
    }
  }, [user, loading]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function submit() {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setSigningUp(true);
    const success = await register({ email, newPassword: password });
    setSigningUp(false);

    if (success) {
      setSuccess(true);
    }
  }

  if (loading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-screen">
        <div className="bg-white">
          <div className="bg-white h-screen w-[100%] p-5">
            <div className="flex justify-self-start items-center">
              <p className="text-start px-2 py-4 text-bold">Logo</p>
            </div>
            <hr />
            <div className=" w-[100%] flex justify-center items-center">
              <div className="p-14 mt-5">
                <div className="flex">
                  <p className="text-2xl tracking-wider font-medium">Sign Up</p>
                </div>
                {success ? (
                  <div className="text-center my-4">
                    <p className="text-green-500 font-medium text-lg">
                      Account created successfully!
                    </p>
                    <p className="text-gray-700 text-sm mt-2">
                      You can now sign in with your new account.
                    </p>
                    <Link
                      to="/signin"
                      className="text-blue-500 underline mt-4 inline-block"
                    >
                      Go to Sign In
                    </Link>
                  </div>
                ) : (
                  <>
                    <p className="md:text-md text-sm tracking-wider text-gray-500 py-2 mb-4">
                      Join us and start your journey!
                    </p>
                    <label className="text-start block uppercase tracking-wider text-gray-700 text-xs font-medium my-2">
                      Email Id
                    </label>
                    <div className="border text-start text-xs rounded py-2 px-6 mb-6 hover:border-2 hover:border-blue-900">
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        className="w-64 outline-none text-base"
                        placeholder="Enter email"
                      />
                    </div>
                    <label className="text-start block uppercase tracking-wider text-gray-700 text-xs font-medium my-2">
                      Password
                    </label>
                    <div className="border text-start text-xs rounded py-2 px-6 mb-6 hover:border-2 hover:border-blue-900">
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        className="w-64 outline-none text-base"
                        placeholder="Enter password"
                      />
                    </div>
                    <label className="text-start block uppercase tracking-wider text-gray-700 text-xs font-medium my-2">
                      Confirm Password
                    </label>
                    <div className="border text-start text-xs rounded py-2 px-6 mb-6 hover:border-2 hover:border-blue-900">
                      <input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                        className="w-64 outline-none text-base"
                        placeholder="Confirm password"
                      />
                    </div>
                    <div className="my-2">
                      <button
                        onClick={submit}
                        disabled={signingUp}
                        className="rounded font-medium w-full py-2 text-white bg-primary "
                      >
                        {signingUp ? "Signing Up..." : "Sign Up"}
                      </button>
                      {error && <div className="text-red-500">{error}</div>}
                    </div>
                    <div>
                      <p className="text-center text-xs text-gray-500">
                        Already have an account?{" "}
                        <span className="text-blue-500">
                          <Link to="/signin">Sign In</Link>
                        </span>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
