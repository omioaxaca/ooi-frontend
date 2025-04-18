"use client"

import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Upload, 
  Camera, 
  Building,
  GraduationCap,
  Hash,
  FileText
} from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { Checkbox } from "@/components/ui/checkbox"
import { User as UserType } from "@/types/user"
import { WithConstructionBanner } from "@/components/with-construction-banner"

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  
  // Expanded user state with signup fields
  const [userData, setUserData] = useState({
    // Basic info
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    birthDate: "",
    profileImage: "/images/profile-default.png",
    
    // Academic info
    schoolGrade: "",
    schoolLevel: "",
    schoolName: "",
    
    // Additional info
    aboutYou: "",
    hobbies: [] as string[],
    pastExperience: "",
  })
  
  // Load user data on mount
  useEffect(() => {
    if (user) {
      setUserData(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        profileImage: user.profileImage || prev.profileImage,
        phoneNumber: user.phoneNumber || prev.phoneNumber,
        birthDate: user.birthDate || prev.birthDate,  
        schoolGrade: user.schoolGrade || prev.schoolGrade,
        schoolLevel: user.schoolLevel || prev.schoolLevel,
        schoolName: user.schoolName || prev.schoolName,
        aboutYou: user.aboutYou || prev.aboutYou,
        hobbies: user.hobbies || prev.hobbies,
        pastExperience: user.pastExperience || prev.pastExperience,
      }))
    }
  }, [user])
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  
  const handleProfileImageClick = () => {
    fileInputRef.current?.click()
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create a preview URL for the selected image
      const url = URL.createObjectURL(file)
      setPreviewImage(url)
    }
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUserData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setUserData(prev => ({
      ...prev,
      [name]: checked
    }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, you would upload the image and update the profile
      const updatedUser: UserType = {
        ...user, 
        id: user?.id || 0,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        profileImage: previewImage || userData.profileImage,
        phoneNumber: userData.phoneNumber,
        birthDate: userData.birthDate,
        schoolGrade: userData.schoolGrade,
        schoolLevel: userData.schoolLevel,
        schoolName: userData.schoolName,
        aboutYou: userData.aboutYou,
        hobbies: userData.hobbies,
        pastExperience: userData.pastExperience,
        roleType: user?.roleType || "STUDENT",
        avatar: user?.avatar || { id: 0, documentId: "", url: "" },
      }
      
      // Update local storage
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      // Update auth context
      if (updateUser) {
        updateUser(updatedUser)
      }
      
      toast.success("Perfil actualizado con éxito")
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error("Error al actualizar el perfil")
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <>
      <AppSidebar />
      <SidebarInset className="min-h-screen pb-0">
        <WithConstructionBanner>
          <div className="container py-6 px-4 md:py-8 md:px-6 max-w-screen-xl">
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbPage>Mi Información</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-ooi-second-blue">Mi Información Personal</CardTitle>
                  <CardDescription>
                    Actualiza tu información personal y datos de contacto
                  </CardDescription>
                </CardHeader>
                
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-6">
                    {/* Profile Image Section */}
                    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                      <div className="relative">
                        <div 
                          className="h-32 w-32 rounded-full overflow-hidden border-4 border-gray-200 cursor-pointer relative"
                          onClick={handleProfileImageClick}
                        >
                          <Image
                            src={previewImage || userData.profileImage}
                            alt="Profile"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Camera className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1"
                          onClick={handleProfileImageClick}
                        >
                          <Upload className="h-3 w-3" />
                          <span className="text-xs">Cambiar</span>
                        </Button>
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nombre Completo</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input 
                                id="name" 
                                name="name" 
                                value={userData.firstName + " " + userData.lastName} 
                                onChange={handleInputChange}
                                className="pl-10"
                                placeholder="Tu nombre completo"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input 
                                id="email" 
                                name="email" 
                                type="email"
                                value={userData.email} 
                                onChange={handleInputChange}
                                className="pl-10"
                                placeholder="tucorreo@ejemplo.com"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input 
                                id="phone" 
                                name="phone" 
                                value={userData.phoneNumber} 
                                onChange={handleInputChange}
                                className="pl-10"
                                placeholder="+52 (000) 000-0000"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="birthday">Fecha de Nacimiento</Label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input 
                                id="birthday" 
                                name="birthday" 
                                type="date"
                                value={userData.birthDate} 
                                onChange={handleInputChange}
                                className="pl-10"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Academic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-ooi-dark-blue">Información Académica</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="school">Escuela</Label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input 
                              id="school" 
                              name="school" 
                              value={userData.schoolName} 
                              onChange={handleInputChange}
                              className="pl-10"
                              placeholder="Nombre de tu escuela"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="schoolLevel">Nivel Escolar</Label>
                          <Select 
                            value={userData.schoolLevel}
                            onValueChange={(value) => handleSelectChange("schoolLevel", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tu nivel escolar" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="secundaria">Secundaria</SelectItem>
                              <SelectItem value="preparatoria">Preparatoria</SelectItem>
                              <SelectItem value="universidad">Universidad</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="schoolGrade">Grado Escolar</Label>
                          <Select
                            value={userData.schoolGrade}
                            onValueChange={(value) => handleSelectChange("schoolGrade", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tu grado" />
                            </SelectTrigger>
                            <SelectContent>
                              {userData.schoolLevel === "secundaria" && (
                                <>
                                  <SelectItem value="1">1° Grado</SelectItem>
                                  <SelectItem value="2">2° Grado</SelectItem>
                                  <SelectItem value="3">3° Grado</SelectItem>
                                </>
                              )}
                              {userData.schoolLevel === "preparatoria" && (
                                <>
                                  <SelectItem value="1">1° Grado</SelectItem>
                                  <SelectItem value="2">2° Grado</SelectItem>
                                  <SelectItem value="3">3° Grado</SelectItem>
                                </>
                              )}
                              {userData.schoolLevel === "universidad" && (
                                <>
                                  <SelectItem value="1">1° Semestre</SelectItem>
                                  <SelectItem value="2">2° Semestre</SelectItem>
                                  <SelectItem value="3">3° Semestre</SelectItem>
                                  <SelectItem value="4">4° Semestre</SelectItem>
                                  <SelectItem value="5">5° Semestre</SelectItem>
                                  <SelectItem value="6">6° Semestre</SelectItem>
                                  <SelectItem value="7">7° Semestre</SelectItem>
                                  <SelectItem value="8">8° Semestre</SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    
                    <Separator />
                    
                    {/* Additional Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-ooi-dark-blue">Información Adicional</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Sobre Mí</Label>
                        <Textarea 
                          id="bio" 
                          name="bio" 
                          value={userData.aboutYou} 
                          onChange={handleInputChange}
                          rows={3}
                          placeholder="Cuéntanos un poco sobre ti, tus intereses y metas..."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="previousExperience">Experiencia Previa en Programación</Label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Textarea 
                            id="previousExperience" 
                            name="previousExperience" 
                            value={userData.pastExperience} 
                            onChange={handleInputChange}
                            className="pl-10"
                            rows={3}
                            placeholder="Describe tu experiencia previa en programación, si tienes alguna..."
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-end gap-2">
                    <Button type="button" variant="outline">Cancelar</Button>
                    <Button 
                      type="submit" 
                      className="bg-ooi-second-blue hover:bg-ooi-blue-hover"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Guardando...
                        </>
                      ) : (
                        'Guardar Cambios'
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          </div>
        </WithConstructionBanner>
      </SidebarInset>
    </>
  )
} 