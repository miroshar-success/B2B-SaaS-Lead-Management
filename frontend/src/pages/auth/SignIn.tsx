/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth";
import Loading from "../../components/Loading";

function SignIn() {
  const { user, login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [logging, setLogging] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/plans");
    }
  }, [user, loading]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit() {
    setLogging(true);
    await login({ email, password });
    setLogging(false);
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
              {/* <FontAwesomeIcon icon={faProjectDiagram} className='md:ml-4' style={{fontSize: "16px", color: "#FE6E49"}}/> */}
              <p className="text-start px-2 py-4 text-bold">Logo</p>
            </div>
            <hr />
            <div className=" w-[100%] flex justify-center items-center">
              <div className="p-14 mt-5">
                <div className="flex">
                  <p className="text-2xl tracking-wider font-medium">SignIn</p>
                </div>
                <p className="md:text-md text-sm tracking-wider text-gray-500 py-2 mb-4">
                  Hi, Welcome Back..
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
                <div className="my-2">
                  <button
                    onClick={submit}
                    disabled={logging}
                    className="rounded font-medium w-full py-2 text-white bg-primary "
                  >
                    {logging ? "Signing..." : "Sign In"}
                  </button>
                  {error && <div className="text-red-500">{error}</div>}
                </div>

                <div>
                  <p className="text-center text-xs text-gray-500">
                    Don't have an account?{" "}
                    <span className="text-blue-500">
                      <Link to="/signup">Sign Up</Link>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;
