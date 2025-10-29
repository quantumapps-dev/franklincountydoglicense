"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Check, DogIcon, User, CreditCard } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
  ownerAddress: z.string().min(5, "Please enter a complete address"),
  ownerPhone: z
    .string()
    .regex(/^[\d\s\-$$$$]+$/, "Please enter a valid phone number")
    .min(10, "Phone number must be at least 10 digits"),
  dogName: z.string().min(1, "Dog name is required"),
  dogBreed: z.string().min(2, "Breed must be at least 2 characters"),
  dogAge: z.coerce.number().positive("Age must be a positive number").int("Age must be a whole number"),
  dogGender: z.enum(["Male", "Female"], { required_error: "Please select a gender" }),
  spayedNeutered: z.enum(["Yes", "No"], { required_error: "Please select an option" }),
  rabiesVaccination: z.string().min(1, "Rabies vaccination date is required"),
})

type FormData = z.infer<typeof formSchema>

const STEPS = [
  { id: 1, name: "Owner Information", icon: User },
  { id: 2, name: "Dog Information", icon: DogIcon },
  { id: 3, name: "Payment", icon: CreditCard },
]

export default function NewApplication() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isClient, setIsClient] = useState(false)
  const [applicationId, setApplicationId] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ownerName: "",
      ownerAddress: "",
      ownerPhone: "",
      dogName: "",
      dogBreed: "",
      dogAge: 0,
      dogGender: undefined,
      spayedNeutered: undefined,
      rabiesVaccination: "",
    },
    mode: "onChange",
  })

  useEffect(() => {
    if (isClient) {
      try {
        const savedData = localStorage.getItem("dog_license_draft")
        if (savedData) {
          const parsed = JSON.parse(savedData)
          form.reset(parsed)
          toast.info("Draft application loaded")
        }
      } catch (error) {
        console.error("Error loading draft:", error)
      }
    }
  }, [isClient, form])

  useEffect(() => {
    if (isClient) {
      const subscription = form.watch((value) => {
        try {
          localStorage.setItem("dog_license_draft", JSON.stringify(value))
        } catch (error) {
          console.error("Error saving draft:", error)
        }
      })
      return () => subscription.unsubscribe()
    }
  }, [form, isClient])

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof FormData)[] = []

    if (step === 1) {
      fieldsToValidate = ["ownerName", "ownerAddress", "ownerPhone"]
    } else if (step === 2) {
      fieldsToValidate = ["dogName", "dogBreed", "dogAge", "dogGender", "spayedNeutered", "rabiesVaccination"]
    }

    const result = await form.trigger(fieldsToValidate)
    return result
  }

  const nextStep = async () => {
    const isValid = await validateStep(currentStep)
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    } else if (!isValid) {
      toast.error("Please fill in all required fields correctly")
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: FormData) => {
    if (!isClient) return

    try {
      const newApplicationId = `FC-DOG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

      const application = {
        id: newApplicationId,
        ...data,
        status: "pending",
        createdTime: new Date().toISOString(),
        title: `Dog License for ${data.dogName}`,
        description: `Owner: ${data.ownerName}, Breed: ${data.dogBreed}`,
      }

      const existingApplications = localStorage.getItem("quantum_applications")
      const applications = existingApplications ? JSON.parse(existingApplications) : []
      applications.push(application)
      localStorage.setItem("quantum_applications", JSON.stringify(applications))

      localStorage.removeItem("dog_license_draft")

      setApplicationId(newApplicationId)
      toast.success("Application submitted successfully!")

      // Reset form
      form.reset()
    } catch (error) {
      console.error("Error submitting application:", error)
      toast.error("Failed to submit application. Please try again.")
    }
  }

  const calculateFee = () => {
    const spayedNeutered = form.watch("spayedNeutered")
    return spayedNeutered === "Yes" ? 15 : 25
  }

  const progress = (currentStep / STEPS.length) * 100

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  if (applicationId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl text-gray-900 dark:text-white">
                Application Submitted Successfully!
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Your dog license application has been received
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Your Application ID:</p>
                <p className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400 break-all">
                  {applicationId}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Please save this ID to track your application status
                </p>
              </div>

              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <p className="font-semibold text-gray-900 dark:text-white">Next Steps:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Your application will be reviewed within 3-5 business days</li>
                  <li>You will receive your dog license by mail once approved</li>
                  <li>Keep your rabies vaccination certificate on file</li>
                  <li>Use the application ID above to track your status</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setApplicationId(null)
                    setCurrentStep(1)
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Submit Another Application
                </Button>
                <Button onClick={() => (window.location.href = "/track-application")} className="flex-1">
                  Track Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <DogIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Franklin County Dog License Application
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Register your dog and ensure compliance with Pennsylvania state law
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all",
                        isActive && "bg-blue-600 border-blue-600 text-white",
                        isCompleted && "bg-green-600 border-green-600 text-white",
                        !isActive &&
                          !isCompleted &&
                          "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400",
                      )}
                    >
                      {isCompleted ? <Check className="w-6 h-6" /> : <StepIcon className="w-6 h-6" />}
                    </div>
                    <p
                      className={cn(
                        "text-xs mt-2 text-center font-medium",
                        isActive && "text-blue-600 dark:text-blue-400",
                        isCompleted && "text-green-600 dark:text-green-400",
                        !isActive && !isCompleted && "text-gray-500 dark:text-gray-400",
                      )}
                    >
                      {step.name}
                    </p>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 mx-2 transition-all",
                        currentStep > step.id ? "bg-green-600" : "bg-gray-300 dark:bg-gray-600",
                      )}
                    />
                  )}
                </div>
              )
            })}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white">{STEPS[currentStep - 1].name}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {currentStep === 1 && "Please provide the dog owner's contact information"}
                  {currentStep === 2 && "Tell us about your dog and vaccination status"}
                  {currentStep === 3 && "Review and complete your application"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Owner Information */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="ownerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormDescription>Legal name of the dog owner</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ownerAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Residential Address *</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St, Chambersburg, PA 17201" {...field} />
                          </FormControl>
                          <FormDescription>Complete street address in Franklin County</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ownerPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="(717) 555-0123" {...field} />
                          </FormControl>
                          <FormDescription>Contact number for application updates</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: Dog Information */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="dogName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dog's Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Max" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dogBreed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Breed *</FormLabel>
                          <FormControl>
                            <Input placeholder="Labrador Retriever" {...field} />
                          </FormControl>
                          <FormDescription>Primary breed or mix</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="dogAge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age (years) *</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" placeholder="3" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dogGender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="spayedNeutered"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Spayed/Neutered Status *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Yes">Yes - Spayed/Neutered</SelectItem>
                              <SelectItem value="No">No - Not Spayed/Neutered</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Affects license fee: Spayed/Neutered $15, Not Spayed/Neutered $25
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rabiesVaccination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rabies Vaccination Date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormDescription>Current rabies vaccination is required by Pennsylvania law</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                      <p className="text-sm text-amber-800 dark:text-amber-200 font-medium mb-2">
                        Important Requirements:
                      </p>
                      <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1 list-disc list-inside">
                        <li>Rabies vaccination must be current and valid</li>
                        <li>You may be required to provide vaccination certificate</li>
                        <li>License must be renewed annually</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Application Summary</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Owner:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{form.watch("ownerName")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Dog Name:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{form.watch("dogName")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Breed:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{form.watch("dogBreed")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Age:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {form.watch("dogAge")} years
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Spayed/Neutered:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {form.watch("spayedNeutered")}
                          </span>
                        </div>
                        <div className="border-t border-blue-200 dark:border-blue-700 pt-3 mt-3">
                          <div className="flex justify-between text-lg">
                            <span className="font-semibold text-gray-900 dark:text-white">License Fee:</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400">${calculateFee()}.00</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <p className="text-sm text-green-800 dark:text-green-200 font-medium mb-2">Payment Information</p>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        This is a demo application. In production, payment would be processed securely through an
                        integrated payment gateway. Your license will be mailed to the address provided within 7-10
                        business days after approval.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600 dark:text-gray-300">
                        By submitting this application, you certify that:
                      </Label>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside ml-2">
                        <li>All information provided is accurate and complete</li>
                        <li>The dog has a current rabies vaccination</li>
                        <li>You understand this license must be renewed annually</li>
                        <li>You agree to comply with all Franklin County dog ordinances</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep < STEPS.length ? (
                    <Button type="button" onClick={nextStep}>
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button type="submit">
                      Submit Application
                      <Check className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>

        {/* Help Section */}
        <Card className="mt-6 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-white">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <p>• All dogs over 3 months old must be licensed in Franklin County, PA</p>
            <p>• Rabies vaccination certificate may be required for verification</p>
            <p>• License fees: $15 (spayed/neutered) or $25 (not spayed/neutered)</p>
            <p>• Your application is automatically saved as you fill it out</p>
            <p>• Contact Franklin County at (717) 261-3897 for assistance</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
