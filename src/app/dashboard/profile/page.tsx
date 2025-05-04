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
import { User as UserType, UpdateUser } from "@/types/user"
import { WithConstructionBanner } from "@/components/with-construction-banner"

export default function ProfilePage() {
  const { user, updateUser, updateAvatar, isLoading } = useAuth()
  
  // Expanded user state with signup fields
  const [userData, setUserData] = useState({
    // Basic info
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    birthDate: "",
    avatar: {
      id: 0,
      documentId: "",
      url: "/images/profile-default.png"
    },
    
    // Academic info
    schoolGrade: "",
    schoolLevel: "",
    schoolName: "",
    
    // Additional info
    aboutYou: "",
    hobbies: "",
    pastExperience: "",
    omegaupUserId: "",
    discordUserId: ""
  })
  
  // Modified to handle the relationship between school level and grade
  const getGradeOptions = (level: string) => {
    switch(level) {
      case "PRIMARIA":
        return [
          { value: "PRIMERO", label: "1° Primaria" },
          { value: "SEGUNDO", label: "2° Primaria" },
          { value: "TERCERO", label: "3° Primaria" },
          { value: "CUARTO", label: "4° Primaria" },
          { value: "QUINTO", label: "5° Primaria" },
          { value: "SEXTO", label: "6° Primaria" },
        ];
      case "SECUNDARIA":
        return [
          { value: "PRIMERO", label: "1° Secundaria" },
          { value: "SEGUNDO", label: "2° Secundaria" },
          { value: "TERCERO", label: "3° Secundaria" },
        ];
      case "PREPARATORIA":
        return [
          { value: "PRIMERO", label: "1° Preparatoria" },
          { value: "SEGUNDO", label: "2° Preparatoria" },
          { value: "TERCERO", label: "3° Preparatoria" },
          { value: "CUARTO", label: "4° Preparatoria" },
          { value: "QUINTO", label: "5° Preparatoria" },
          { value: "SEXTO", label: "6° Preparatoria" },
        ];
      default:
        return [];
    }
  };
  
  // Load user data on mount
  useEffect(() => {
    if (user) {
      // Normalize the school level and grade values to match our options
      const normalizedSchoolLevel = user.schoolLevel?.toUpperCase() || "";
      const normalizedSchoolGrade = user.schoolGrade?.toUpperCase() || "";

      console.log("Initial values:", {
        level: normalizedSchoolLevel,
        grade: normalizedSchoolGrade
      });

      setUserData(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        avatar: user.avatar || prev.avatar,
        phoneNumber: user.phoneNumber || prev.phoneNumber,
        birthDate: user.birthDate || prev.birthDate,  
        schoolGrade: normalizedSchoolGrade,
        schoolLevel: normalizedSchoolLevel,
        schoolName: user.schoolName || prev.schoolName,
        aboutYou: user.aboutYou || prev.aboutYou,
        hobbies: user.hobbies || prev.hobbies,
        pastExperience: user.pastExperience || prev.pastExperience,
        omegaupUserId: user.omegaupUserId || prev.omegaupUserId,
        discordUserId: user.discordUserId || prev.discordUserId
      }))
    }
  }, [user])
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  
  const handleProfileImageClick = () => {
    fileInputRef.current?.click()
  }
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setLoading(true)
        // Create a preview URL for the selected image
        const url = URL.createObjectURL(file)
        setPreviewImage(url)
        
        // Update avatar using the auth context function
        await updateAvatar(file)
        toast.success("Avatar actualizado con éxito")
      } catch (error) {
        console.error('Avatar update error:', error)
        toast.error("Error al actualizar el avatar")
      } finally {
        setLoading(false)
      }
    }
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUserData(prev => ({
      ...prev,
      [name]: value
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
      // Prepare the update data according to UpdateUser type
      const updateData: UpdateUser = {
        phoneNumber: userData.phoneNumber,
        birthDate: userData.birthDate,
        schoolName: userData.schoolName,
        schoolLevel: userData.schoolLevel,
        schoolGrade: userData.schoolGrade,
        aboutYou: userData.aboutYou,
        hobbies: userData.hobbies,
        pastExperience: userData.pastExperience,
        omegaupUserId: userData.omegaupUserId,
        discordUserId: userData.discordUserId
      }

      // Update user using the auth context function
      await updateUser(updateData)
      toast.success("Perfil actualizado con éxito")
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error("Error al actualizar el perfil")
    } finally {
      setLoading(false)
    }
  }
  
  // Reset grade when level changes
  const handleSchoolLevelChange = (value: string) => {
    if (value !== userData.schoolLevel) {
      console.log("Level changed to:", value);
      handleSelectChange("schoolLevel", value)
      handleSelectChange("schoolGrade", "")  // Reset the grade when level changes
    }
  }

  const handleSchoolGradeChange = (value: string) => {
    if (value !== userData.schoolGrade) {
      console.log("Grade changed to:", value);
      handleSelectChange("schoolGrade", value)
    }
  }
  
  return (
    <>
      <AppSidebar />
      <SidebarInset className="min-h-screen pb-0">
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
                          src={previewImage || `https://api.omioaxaca.org${userData.avatar.url}`}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Camera className="h-8 w-8 text-white" />
                        </div>
                        {(loading || isLoading) && (
                          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2">
                              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                              <span className="text-white text-sm">Guardando...</span>
                            </div>
                          </div>
                        )}
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
                              disabled={true}
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
                              disabled={true}
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
                              name="phoneNumber" 
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
                              name="birthDate" 
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

                   {/* External Accounts Information */}
                   <div className="space-y-4">
                    <h3 className="text-lg font-medium text-ooi-dark-blue">Información de Cuentas Externas</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="omegaupUserId">Usuario de OmegaUp</Label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input 
                            id="omegaupUserId" 
                            name="omegaupUserId" 
                            value={userData.omegaupUserId} 
                            onChange={handleInputChange}
                            className="pl-10"
                            placeholder="Tu usuario de OmegaUp"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="discordUserId">Usuario de Discord</Label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input 
                            id="discordUserId" 
                            name="discordUserId" 
                            value={userData.discordUserId} 
                            onChange={handleInputChange}
                            className="pl-10"
                            placeholder="Tu usuario de Discord"
                          />
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
                            name="schoolName" 
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
                          onValueChange={handleSchoolLevelChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu nivel escolar">
                              {userData.schoolLevel ? (
                                userData.schoolLevel === "PRIMARIA" ? "Primaria" :
                                userData.schoolLevel === "SECUNDARIA" ? "Secundaria" :
                                userData.schoolLevel === "PREPARATORIA" ? "Preparatoria / Bachillerato" :
                                ""
                              ) : ""}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem key="PRIMARIA" value="PRIMARIA">Primaria</SelectItem>
                            <SelectItem key="SECUNDARIA" value="SECUNDARIA">Secundaria</SelectItem>
                            <SelectItem key="PREPARATORIA" value="PREPARATORIA">Preparatoria / Bachillerato</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="schoolGrade">Grado Escolar</Label>
                        <Select
                          value={userData.schoolGrade}
                          onValueChange={handleSchoolGradeChange}
                          disabled={!userData.schoolLevel}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={userData.schoolLevel ? "Selecciona tu grado" : "Primero selecciona nivel"}>
                              {userData.schoolGrade && getGradeOptions(userData.schoolLevel).find(opt => opt.value === userData.schoolGrade)?.label}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {getGradeOptions(userData.schoolLevel).map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
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
                        name="aboutYou" 
                        value={userData.aboutYou} 
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Cuéntanos un poco sobre ti, tus intereses y metas..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hobbies">Hobbies</Label>
                      <Textarea 
                        id="hobbies" 
                        name="hobbies" 
                        value={userData.hobbies} 
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Cuéntanos sobre tus hobbies y actividades favoritas..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="previousExperience">Experiencia Previa en Programación</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Textarea 
                          id="previousExperience" 
                          name="pastExperience" 
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
                
                <CardFooter className="flex justify-end gap-2 p-6">
                  <Button type="button" variant="outline">Cancelar</Button>
                  <Button 
                    type="submit" 
                    className="bg-ooi-second-blue hover:bg-ooi-blue-hover"
                    disabled={loading || isLoading}
                  >
                    {loading || isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Guardando...</span>
                      </div>
                    ) : (
                      'Guardar Cambios'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </div>
      </SidebarInset>
    </>
  )
} 