"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, DogIcon, Shield, FileText } from "lucide-react"

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <DogIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Franklin County Dog License</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-2">
            Official dog licensing for Franklin County, Pennsylvania
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Quick, easy, and secure online registration</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Plus className="w-5 h-5 text-blue-600" />
                New License Application
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Register your dog and obtain an official Franklin County license
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/new-application">
                <Button className="w-full" size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Start Application
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Search className="w-5 h-5 text-green-600" />
                Track Application
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Check the status of your submitted license application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/track-application">
                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  <Search className="w-4 h-4 mr-2" />
                  Track Status
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-md">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-lg text-gray-900 dark:text-white">Required by Law</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 dark:text-gray-300">
              All dogs over 3 months old must be licensed in Franklin County, Pennsylvania
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-md">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-lg text-gray-900 dark:text-white">Simple Process</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 dark:text-gray-300">
              Complete the online form, pay the fee, and receive your license by mail
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-md">
            <CardHeader>
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center mb-3">
                <DogIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle className="text-lg text-gray-900 dark:text-white">Affordable Fees</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 dark:text-gray-300">
              $15 for spayed/neutered dogs, $25 for non-spayed/neutered dogs
            </CardContent>
          </Card>
        </div>

        {/* Requirements Section */}
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-white">License Requirements</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              What you need to complete your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Required Information:</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                    <span>Owner's full name and contact information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                    <span>Complete residential address in Franklin County</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                    <span>Dog's name, breed, age, and gender</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                    <span>Current rabies vaccination date</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Important Notes:</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                    <span>Rabies vaccination must be current and valid</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                    <span>License must be renewed annually</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                    <span>Vaccination certificate may be required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                    <span>License will be mailed within 7-10 business days</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Questions? Contact Franklin County at{" "}
            <a href="tel:7172613897" className="text-blue-600 dark:text-blue-400 hover:underline">
              (717) 261-3897
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
