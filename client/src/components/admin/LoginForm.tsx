import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const auth = getAuth();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    
    try {
      const result = await login(data.email, data.password);
      
      if (!result.success) {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthorizeUser = async () => {
    if (!authEmail) {
      toast({
        title: "Email required",
        description: "Please enter an email address.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsAuthorizing(true);

    try {
      // Check if user exists in Firestore users collection
      const usersCollection = collection(db, 'users');
      const userQuery = query(usersCollection, where('email', '==', authEmail));
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        toast({
          title: "User not found",
          description: "This email address is not authorized. Please contact an administrator to add this user first.",
          variant: "destructive",
          duration: 5000,
        });
        return;
      }

      // User exists in the manage users section, send password reset email
      await sendPasswordResetEmail(auth, authEmail);
      
      toast({
        title: "Password reset sent",
        description: `A password reset link has been sent to ${authEmail}. Check your email to set up your password.`,
        duration: 5000,
      });

      setShowAuthDialog(false);
      setAuthEmail("");
    } catch (error) {
      console.error("Authorization error:", error);
      toast({
        title: "Authorization failed",
        description: "Failed to send password reset email. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsAuthorizing(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl mb-6 text-center">Login</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    {...field} 
                    className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    {...field} 
                    className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-accent hover:bg-accent/90 text-white py-3 px-6 rounded-full transition-colors w-full"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <Button 
          onClick={() => setShowAuthDialog(true)}
          variant="outline"
          className="w-full py-3 px-6 rounded-full transition-colors"
        >
          Authorize New User
        </Button>
      </div>

      {/* Authorization Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Authorize New User</DialogTitle>
            <DialogDescription>
              Enter the email address of the user you want to authorize. This email must already be added in the Manage Users section.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAuthDialog(false);
                setAuthEmail("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAuthorizeUser}
              disabled={isAuthorizing}
              className="bg-accent hover:bg-accent/90"
            >
              {isAuthorizing ? "Sending..." : "Send Password Reset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoginForm;
