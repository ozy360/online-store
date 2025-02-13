"use client";
import toast, { Toaster } from "sonner";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/loadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [loading, setLoading] = useState<boolean>();
  const envemail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const envpass = process.env.NEXT_PUBLIC_ADMIN_PASS;

  async function loginFunc() {
    if (!email || !password) return;
    const data = {
      email: email,
      password: password,
    };
    try {
      setLoading(true);
      const res = await axios.post("/api/auth/login", data);

      const cdata = res.data;
      if (cdata.message) {
        router.push("/admin");
      } else if (cdata.error) {
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      console.error(error.response?.data?.error || "An error occurred");
    }
  }
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="px-2 w-[95%] sm:w-[30%] mx-auto">
              {/* <div className="text-right">
                <span>
                  <b>Email: </b>
                  {envemail}
                </span>
                <br />
                <span>
                  <b>Password: </b>
                  {envpass}
                </span>
              </div> */}
              <Card className="bg-white p-4">
                <div className="space-y-5">
                  <p className="text-xl font-semibold">Gain Access</p>
                  <Toaster />
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="text"
                      id="email"
                      placeholder="example@example.com"
                      className="w-full"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      type="password"
                      id="password"
                      placeholder="1234"
                      className="w-full"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div>
                    <Button className="w-full" onClick={loginFunc}>
                      Submit
                    </Button>
                  </div>
                  <p className="text-sm text-center text-muted-foreground hover:underline">
                    <a href="/">Back to home</a>
                  </p>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  );
}
