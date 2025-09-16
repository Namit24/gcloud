"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Github, Linkedin, Mail, Briefcase, User, Code, Trophy, BookOpen, ExternalLink } from "lucide-react"
import Image from "next/image"
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock"
import { GlowCard } from "@/components/ui/spotlight-card"
import { CursorProvider, Cursor, CursorFollow } from "@/components/ui/cursor"
import { PromptInputBox } from "@/components/ui/ai-prompt-box"
import { GlassButton } from "@/components/ui/glass-button"

export default function Portfolio() {
  const [isMobile, setIsMobile] = useState(false)
  const [nameText, setNameText] = useState("")
  const [descText, setDescText] = useState("")
  const [showDesc, setShowDesc] = useState(false)
  const [comingSoonText, setComingSoonText] = useState("")

  const nameFullText = "Hi, I'm Namit Solanki"
  const descFullText =
    "I'm actively contributing to open-source projects like Scikit-Learn and have developed innovative solutions. My work spans across machine learning, data science, and mobile app development. If you're working on something real, let's talk."
  const comingSoonFullText = "More exciting projects coming soon..."
  const autoTypeFullText =
    "I'm actively contributing to open-source projects like Scikit-Learn and have developed innovative solutions. My work spans across machine learning, data science, and mobile app development. If you're working on something real, let's talk."

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    let nameIndex = 0
    const nameTimer = setInterval(() => {
      if (nameIndex < nameFullText.length) {
        setNameText(nameFullText.slice(0, nameIndex + 1))
        nameIndex++
      } else {
        clearInterval(nameTimer)
        setShowDesc(true)
      }
    }, 100)

    return () => clearInterval(nameTimer)
  }, [])

  useEffect(() => {
    if (showDesc) {
      let descIndex = 0
      const descTimer = setInterval(() => {
        if (descIndex < descFullText.length) {
          setDescText(descFullText.slice(0, descIndex + 1))
          descIndex++
        } else {
          clearInterval(descTimer)
        }
      }, 30)

      return () => clearInterval(descTimer)
    }
  }, [showDesc])

  useEffect(() => {
    const timer = setTimeout(() => {
      let comingIndex = 0
      const comingTimer = setInterval(() => {
        if (comingIndex < comingSoonFullText.length) {
          setComingSoonText(comingSoonFullText.slice(0, comingIndex + 1))
          comingIndex++
        } else {
          clearInterval(comingTimer)
        }
      }, 80)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.05 : 0.1,
        delayChildren: isMobile ? 0.05 : 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: isMobile ? 30 : 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: isMobile ? 300 : 200,
        damping: isMobile ? 25 : 20,
        duration: isMobile ? 0.4 : 0.6,
      },
    },
  }

  const projects = [
    {
      title: "GSoC Contributor for sklearn",
      period: "May 2025 – Present",
      company: "Open Source",
      description:
        "Contributed to Random Forest algorithm under Supervised Machine Learning by improving scikit-learn's file caching behaviour to follow OS-specific conventions.",
      tech: ["Python", "Machine Learning", "Open Source"],
      logo: "/images/sklearn-logo.png",
    },
    {
      title: "DBMS & Data Science Intern",
      period: "March 2025 – April 2025",
      company: "Nereus Technologies",
      description:
        "Developed PostgreSQL database and backend system for real-time IMU sensor data, implemented Bluetooth connectivity, and designed admin & user dashboards.",
      tech: ["PostgreSQL", "Python", "Bluetooth", "Dashboard"],
      logo: "/images/nereus-logo.svg",
    },
    {
      title: "Fi Nexus",
      period: "Jan 2025 – Present",
      company: "Self-Employed",
      description:
        "Built a comprehensive finance dashboard website with Fi Money MCP server integration for real-time financial data tracking and analytics.",
      tech: ["Next.js", "Python", "PostgreSQL"],
    },
    {
      title: "No Code ML Model Builder",
      period: "Sept 2024 – Present",
      company: "Self-Employed",
      description:
        "Developed a no-code machine learning model builder with Python scripts on Uvicorn server, integrated scikit-learn, matplotlib, and Streamlit.",
      tech: ["Python", "Streamlit", "ML", "Uvicorn"],
    },
    {
      title: "Anti-Cheating Extension",
      period: "March 2025 – May 2025",
      company: "Self-Employed",
      description:
        "Created anti-cheating browser extension to monitor student activity during online exams, blocking tab switching and detecting focus loss.",
      tech: ["JavaScript", "Chrome Extension", "Manifest V3"],
    },
  ]

  const skills = [
    "Machine Learning",
    "Data Science",
    "App Development",
    "Python",
    "Kotlin",
    "C++",
    "JavaScript",
    "Firebase",
    "SQL",
    "Git",
    "GitHub",
    "Flutter",
    "Dart",
    "Linux",
    "Transformers",
  ]

  const awards = [
    {
      title: "Runner Up in TechXlerate Hackathon",
      organization: "BITS Pilani",
      date: "Feb 2025",
      description:
        "Lead a team to runner's up position in SaaS domain out of total 350 teams participating from all over India.",
      logo: "/images/bits-pilani-logo.svg",
    },
    {
      title: "OXML 25",
      organization: "University of Oxford",
      date: "March 2025",
      description:
        "Selected for Oxford Machine Learning Summer School 2025, focusing on advanced ML research and applications.",
      logo: "/images/oxford-logo.png",
    },
  ]

  const blogs = [
    {
      title: "Grok: xAI's Brilliant AI for Everyone",
      description: "Exploring xAI's revolutionary approach to artificial intelligence and its impact on the future.",
      url: "https://www.notion.so/Grok-xAIs-Brilliant-AI-for-Everyone-1f60455bfa8d802dab51cbe8fda9998a",
      type: "Article",
      logo: "/images/grok-logo.png",
    },
    {
      title: "Natural Language Processing (NLP) Basics",
      description: "A comprehensive guide to understanding the fundamentals of Natural Language Processing.",
      url: "https://www.notion.so/Natural-Language-Processing-NLP-2000455bfa8d80629c5cc31a6b709a91",
      type: "Guide",
      logo: "/images/nlp-logo.png",
    },
    {
      title: "Google I/O 2025",
      description: "Insights and highlights from Google's annual developer conference.",
      url: "https://drive.google.com/drive/u/2/folders/1_UgltTS478MFtPz3VDgE3sybrz1VdBJr",
      type: "Article",
      logo: "/images/google-logo.png",
    },
  ]

  const dockItems = [
    {
      title: "About",
      icon: <User className="h-full w-full text-neutral-300" />,
      href: "#about",
    },
    {
      title: "Projects",
      icon: <Code className="h-full w-full text-neutral-300" />,
      href: "#projects",
    },
    {
      title: "Blogs",
      icon: <BookOpen className="h-full w-full text-neutral-300" />,
      href: "#blogs",
    },
    {
      title: "Awards",
      icon: <Trophy className="h-full w-full text-neutral-300" />,
      href: "#awards",
    },
    {
      title: "GitHub",
      icon: <Github className="h-full w-full text-neutral-300" />,
      href: "https://github.com/Namit24",
    },
    {
      title: "LinkedIn",
      icon: <Linkedin className="h-full w-full text-neutral-300" />,
      href: "https://www.linkedin.com/in/namit-solanki/",
    },
    {
      title: "Email",
      icon: <Mail className="h-full w-full text-neutral-300" />,
      href: "mailto:namit2004nss@gmail.com",
    },
  ]

  const handleSendMessage = (message: string, files?: File[]) => {
    console.log("Message:", message)
    console.log("Files:", files)
  }

  return (
    <CursorProvider className="min-h-screen bg-black text-white dark">
      <Cursor>
        <svg className="size-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
          <path
            fill="currentColor"
            d="M1.8 4.4 7 36.2c.3 1.8 2.6 2.3 3.6.8l3.9-5.7c1.7-2.5 4.5-4.1 7.5-4.3l6.9-.5c1.8-.1 2.5-2.4 1.1-3.5L5 2.5c-1.4-1.1-3.5 0-3.3 1.9Z"
          />
        </svg>
      </Cursor>
      <CursorFollow>
        <div className="bg-blue-500 text-white px-2 py-1 rounded-lg text-sm shadow-lg">Developer</div>
      </CursorFollow>

      {/* Apple-style Dock Navigation */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <Dock className={`items-end pb-3 ${isMobile ? "scale-75" : ""}`}>
          {dockItems.slice(0, isMobile ? 5 : dockItems.length).map((item, idx) => (
            <DockItem
              key={idx}
              className="aspect-square rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors"
            >
              <DockLabel>{item.title}</DockLabel>
              <DockIcon>
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : "_self"}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : ""}
                  className="w-full h-full flex items-center justify-center"
                >
                  {item.icon}
                </a>
              </DockIcon>
            </DockItem>
          ))}
        </Dock>
      </div>

      {/* Main Content */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        {/* Hero/About Section - Centered like Fardeen's design */}
        <motion.section
          id="about"
          className="min-h-screen flex flex-col items-center justify-center px-4 md:px-6 text-center relative"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Profile Image */}
          <motion.div className="mb-8 relative z-10" variants={itemVariants}>
            <div className="relative group">
              {/* Custom circular glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Profile image with proper circular styling */}
              <Image
                src="/images/profile-avatar.jpeg"
                alt="Namit Solanki Profile"
                width={200}
                height={200}
                className="relative rounded-full w-32 h-32 md:w-36 md:h-36 object-cover border-4 border-white/20 shadow-2xl mx-auto transition-transform duration-300 hover:scale-105"
              />
            </div>
          </motion.div>

          {/* Name and Title */}
          <motion.div className="mb-8 relative z-10" variants={itemVariants}>
            <h1 className="text-xl font-bold mb-4 text-white min-h-[2rem]">
              {nameText}
              <span className="animate-pulse">|</span>
            </h1>
            <p className="text-xl text-gray-300 mb-6">ML, NLP, Football, Yap Enthusiast</p>
          </motion.div>

          {/* AI Prompt Box for About Me */}
          <motion.div className="w-full max-w-2xl mb-8 relative z-10" variants={itemVariants}>
            <PromptInputBox
              onSend={handleSendMessage}
              placeholder="Tell me about yourself, your projects, or anything you'd like to know!"
              className="backdrop-blur-xl bg-white/5 border-white/20"
              autoTypeText={autoTypeFullText}
              autoTypeSpeed={30}
            />
          </motion.div>

          {/* CTA Buttons with Glass Effect */}
          <motion.div className="flex flex-wrap gap-4 mb-12 relative z-10 justify-center" variants={itemVariants}>
            <GlassButton variant="primary" size="md">
              <a href="#projects" className="flex items-center gap-2">
                View work
              </a>
            </GlassButton>
            <GlassButton variant="secondary" size="md">
              <a href="#blogs" className="flex items-center gap-2">
                Read blogs
              </a>
            </GlassButton>
            <GlassButton variant="outline" size="md">
              <a href="mailto:namit2004nss@gmail.com" className="flex items-center gap-2">
                Get in touch
              </a>
            </GlassButton>
          </motion.div>

          {/* Role Tags */}
          <motion.div className="flex flex-wrap justify-center gap-3 relative z-10" variants={itemVariants}>
            {["Android Co-Lead at GDG", "GSoC Contributor", "Hackathon Winner"].map((role) => (
              <span
                key={role}
                className="px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-sm border border-white/30"
              >
                {role}
              </span>
            ))}
          </motion.div>
        </motion.section>

        {/* Experience Section */}
        <motion.section
          id="projects"
          className="py-20 px-4 md:px-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.h2 className="text-2xl font-bold text-center mb-16 text-white" variants={itemVariants}>
              Experience & Projects
            </motion.h2>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {projects.map((project, index) => (
                <motion.div key={project.title} variants={itemVariants}>
                  <GlowCard glowColor="blue" customSize={true} className="w-full aspect-square">
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {project.logo ? (
                            <Image
                              src={project.logo || "/placeholder.svg"}
                              alt={`${project.company} logo`}
                              width={24}
                              height={24}
                              className="w-6 h-6 object-contain"
                            />
                          ) : (
                            <div className="p-1 bg-secondary rounded">
                              <Briefcase className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-100">{project.period}</span>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-sm font-semibold mb-2">{project.title}</h3>
                        <p className="text-xs text-gray-100 mb-2">{project.company}</p>
                        <p className="text-xs text-gray-100 leading-relaxed line-clamp-3">{project.description}</p>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {project.tech.slice(0, 3).map((tech) => (
                          <span key={tech} className="px-2 py-1 bg-secondary text-white rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}

              {/* Coming Soon Card */}
              <motion.div variants={itemVariants}>
                <GlowCard
                  glowColor="blue"
                  customSize={true}
                  className="w-full aspect-square border-dashed border-2 border-gray-600"
                >
                  <div className="flex flex-col h-full items-center justify-center text-center">
                    <div className="mb-4">
                      <Code className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    </div>
                    <p className="text-sm text-gray-300 min-h-[1.5rem]">
                      {comingSoonText}
                      <span className="animate-pulse">|</span>
                    </p>
                  </div>
                </GlowCard>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Blogs Section */}
        <motion.section
          id="blogs"
          className="py-20 px-4 md:px-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.h2 className="text-2xl font-bold text-center mb-16 text-white" variants={itemVariants}>
              Blogs & Articles
            </motion.h2>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {blogs.map((blog, index) => (
                <motion.div key={blog.title} variants={itemVariants}>
                  <GlowCard glowColor="purple" customSize={true} className="w-full aspect-square">
                    <a
                      href={blog.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full group cursor-none"
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex items-start justify-between mb-3">
                          <Image
                            src={blog.logo || "/placeholder.svg"}
                            alt={`${blog.title} logo`}
                            width={24}
                            height={24}
                            className="w-6 h-6 object-contain"
                          />
                          <div className="flex items-center gap-1 text-xs text-gray-100">
                            <span>{blog.type}</span>
                            <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-sm font-semibold mb-2 group-hover:text-white transition-colors line-clamp-2">
                            {blog.title}
                          </h3>
                          <p className="text-xs text-gray-100 leading-relaxed line-clamp-4">{blog.description}</p>
                        </div>
                      </div>
                    </a>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Skills Section */}
        <motion.section
          className="py-20 px-4 md:px-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.h2 className="text-2xl font-bold text-center mb-16 text-white" variants={itemVariants}>
              Skills & Technologies
            </motion.h2>

            <motion.div className="bg-card rounded-2xl p-8 border border-border" variants={itemVariants}>
              <div className="flex flex-wrap gap-3 justify-center">
                {skills.map((skill) => (
                  <motion.div
                    key={skill}
                    className="px-4 py-2 bg-secondary text-white rounded-full text-sm hover:bg-accent transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Awards Section */}
        <motion.section
          id="awards"
          className="py-20 px-4 md:px-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.h2 className="text-2xl font-bold text-center mb-16 text-white" variants={itemVariants}>
              Awards & Recognition
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-6">
              {awards.map((award) => (
                <motion.div key={award.title} variants={itemVariants}>
                  <GlowCard glowColor="green" customSize={true} className="w-full aspect-[5/3] h-48">
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-2">
                        <Image
                          src={award.logo || "/placeholder.svg"}
                          alt={`${award.organization} logo`}
                          width={award.organization === "BITS Pilani" ? 28 : 24}
                          height={award.organization === "BITS Pilani" ? 28 : 24}
                          className={`object-contain ${award.organization === "BITS Pilani" ? "w-7 h-7" : "w-6 h-6"}`}
                        />
                        <span className="text-xs text-gray-300">{award.date}</span>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-white mb-1">{award.title}</h3>
                        <p className="text-xs text-gray-300 mb-2">{award.organization}</p>
                        <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">{award.description}</p>
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          className="py-20 px-6 border-t border-border mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div className="mb-6">
              <h3 className="text-2xl font-bold mb-2 text-white">Let's Connect!</h3>
              <p className="text-gray-300">Ready to collaborate on something amazing?</p>
            </motion.div>

            <motion.p className="text-gray-300 text-sm">Last updated September 2025</motion.p>
          </div>
        </motion.footer>
      </motion.div>
    </CursorProvider>
  )
}
