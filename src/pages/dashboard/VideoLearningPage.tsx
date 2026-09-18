import React, { useEffect, useState } from 'react'
import { Play, CheckCircle2, FileText, Download, Bookmark, Award, ChevronRight, Lock } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'

const lessonBySkill = {
    '1': {
        course: 'Khóa học Frontend React',
        chapter: 'Chương 1: Core Concepts',
        title: 'Bài 2: React Components & Props cơ bản',
        description: 'Thiết kế Component độc lập, tái sử dụng và truyền nhận dữ liệu thông qua Props trong React 19.',
        lessons: ['Giới thiệu React 19 & JSX', 'React Components & Props', 'State Management với useState', 'Side Effects với useEffect'],
    },
    '2': {
        course: 'Khóa học Backend NestJS',
        chapter: 'Chương 1: NestJS Core',
        title: 'Bài 2: Dependency Injection & Module Architecture',
        description: 'Tổ chức module, controller và service để xây dựng backend NestJS có thể mở rộng.',
        lessons: ['Node.js và NestJS nền tảng', 'Dependency Injection & Modules', 'Controllers và Services', 'Authentication với JWT'],
    },
    '3': {
        course: 'Khóa học Database SQL',
        chapter: 'Chương 1: SQL chuyên sâu',
        title: 'Bài 2: Index, Query Plan & tối ưu truy vấn MySQL',
        description: 'Đọc Query Plan, thiết kế Index và tối ưu các truy vấn MySQL trong hệ thống thực tế.',
        lessons: ['SQL nền tảng và JOIN', 'Index và Query Plan', 'Transaction và Locking', 'Thiết kế schema thực tế'],
    },
    '4': {
        course: 'Khóa học Python Data Analysis',
        chapter: 'Chương 1: Python Core',
        title: 'Bài 2: DataFrame, Filtering & GroupBy với Pandas',
        description: 'Làm sạch, lọc và tổng hợp dữ liệu bằng DataFrame và GroupBy trong Pandas.',
        lessons: ['Python và cấu trúc dữ liệu', 'DataFrame và Filtering', 'GroupBy và Aggregation', 'Trực quan hóa dữ liệu'],
    },
    '5': {
        course: 'Khóa học Software Testing',
        chapter: 'Chương 1: Manual Testing',
        title: 'Bài 2: Viết Test Case và chiến lược kiểm thử',
        description: 'Phân tích yêu cầu và viết Test Case rõ ràng, có khả năng bao phủ các luồng quan trọng.',
        lessons: ['Tổng quan quy trình QA', 'Viết Test Case', 'Bug Report hiệu quả', 'Playwright Automation'],
    },
    '6': {
        course: 'Khóa học Mobile đa nền tảng',
        chapter: 'Chương 1: Mobile UI',
        title: 'Bài 2: Thiết kế UI và quản lý state mobile',
        description: 'Xây dựng giao diện responsive và quản lý state cho ứng dụng Flutter hoặc React Native.',
        lessons: ['Kiến trúc ứng dụng mobile', 'UI responsive và navigation', 'State management', 'Kết nối REST API'],
    },
} as const

export const VideoLearningPage: React.FC = () => {
    const { id = '1' } = useParams<{ id: string }>()
    const lesson = lessonBySkill[id as keyof typeof lessonBySkill] ?? lessonBySkill['1']
    const notesStorageKey = `skillgarden-video-notes-${id}`
    const [activeTab, setActiveTab] = useState<'notes' | 'materials'>('notes')
    const [noteText, setNoteText] = useState('')
    const [notesList, setNotesList] = useState(() => {
        const defaultNotes = [
            { id: 1, time: '02:45', content: 'Cần lưu ý cơ chế Virtual DOM của React giúp tối ưu render.' },
            { id: 2, time: '05:10', content: 'Hàm useState trả về 1 tuple gồm state và hàm setState.' }
        ]
        const savedNotes = localStorage.getItem(notesStorageKey)
        if (!savedNotes) return defaultNotes

        try {
            const parsedNotes = JSON.parse(savedNotes)
            return Array.isArray(parsedNotes) ? parsedNotes : defaultNotes
        } catch {
            localStorage.removeItem(notesStorageKey)
            return defaultNotes
        }
    })

    useEffect(() => {
        localStorage.setItem(notesStorageKey, JSON.stringify(notesList))
    }, [notesList, notesStorageKey])

    const handleAddNote = () => {
        if (!noteText.trim()) return
        setNotesList([...notesList, { id: Date.now(), time: '06:30', content: noteText }])
        setNoteText('')
    }

    const handleDownloadMaterial = () => {
        const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 102 >>
stream
BT
/F1 18 Tf
72 720 Td
(${lesson.title.replace(/[()\\]/g, '\\$&')}) Tj
/F1 12 Tf
0 -32 Td
(Tai lieu hoc tap SkillGarden) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
0
%%EOF`
        const downloadUrl = URL.createObjectURL(new Blob([pdfContent], { type: 'application/pdf' }))
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = `SkillGarden-${id}-tai-lieu.pdf`
        link.click()
        URL.revokeObjectURL(downloadUrl)
    }

    const lessons = lesson.lessons.map((title, index) => ({
        id: index + 1,
        title: `${index + 1}. ${title}`,
        duration: ['12:45', '18:20', '25:15', '20:00'][index],
        status: index === 0 ? 'completed' : index === 1 ? 'active' : 'locked'
    }))

    return (
        <div className="min-h-screen bg-[#FAFAF7] text-[#20223A] pb-12">
            {/* Header breadcrumb */}
            <div className="bg-white border-b border-[#E2E4EB] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-[#6B6D7A]">
                    <span>{lesson.course}</span>
                    <ChevronRight className="w-4 h-4" />
                    <span>{lesson.chapter}</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="font-bold text-[#3C4097]">{lesson.title}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#DCEFE1] text-[#2C6A3D] text-xs font-bold rounded-full">
                        +50 XP Thưởng
                    </span>
                    <Button variant="indigo" size="sm" className="font-bold">
                        Đánh dấu hoàn thành
                    </Button>
                </div>
            </div>

            {/* Main content grid */}
            <div className="max-w-7xl mx-auto px-6 pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Video Player & Tabs */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Video Player Box */}
                    <div className="bg-black rounded-2xl aspect-video overflow-hidden relative shadow-xl flex items-center justify-center border border-[#E2E4EB]">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0"
                            title="React 19 Video Lesson"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>

                    {/* Lesson Info */}
                    <div className="bg-white rounded-2xl p-6 border border-[#E2E4EB] shadow-sm space-y-4">
                        <h1 className="text-2xl font-bold text-[#20223A]">
                            {lesson.title}
                        </h1>
                        <p className="text-sm text-[#6B6D7A] leading-relaxed">
                            {lesson.description}
                        </p>

                        {/* Tabs */}
                        <div className="flex border-b border-[#E2E4EB] pt-2">
                            <button
                                onClick={() => setActiveTab('notes')}
                                className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'notes'
                                        ? 'border-[#3C4097] text-[#3C4097]'
                                        : 'border-transparent text-[#6B6D7A] hover:text-[#20223A]'
                                    }`}
                            >
                                Ghi chú cá nhân ({notesList.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('materials')}
                                className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'materials'
                                        ? 'border-[#3C4097] text-[#3C4097]'
                                        : 'border-transparent text-[#6B6D7A] hover:text-[#20223A]'
                                    }`}
                            >
                                Tài liệu PDF đính kèm (2)
                            </button>
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'notes' ? (
                            <div className="space-y-4 pt-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={noteText}
                                        onChange={(e) => setNoteText(e.target.value)}
                                        placeholder="Nhập ghi chú tại thời điểm video này..."
                                        className="flex-1 px-4 py-2 bg-gray-50 border border-[#E2E4EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3C4097]"
                                    />
                                    <Button variant="indigo" onClick={handleAddNote}>Lưu ghi chú</Button>
                                </div>
                                <div className="space-y-2">
                                    {notesList.map((n) => (
                                        <div key={n.id} className="p-3 bg-gray-50 rounded-xl flex items-start justify-between text-xs">
                                            <span className="font-mono bg-[#3C4097] text-white px-2 py-0.5 rounded font-bold">{n.time}</span>
                                            <p className="flex-1 mx-3 text-[#20223A] font-medium">{n.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3 pt-2">
                                <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-[#3C4097]" />
                                        <div>
                                            <p className="text-xs font-bold">Slide_Bai_2_React_Props.pdf</p>
                                            <p className="text-[11px] text-[#6B6D7A]">Dung lượng: 2.4 MB</p>
                                        </div>
                                    </div>
                                    <Button type="button" variant="outline" size="sm" className="flex items-center gap-1" onClick={handleDownloadMaterial}>
                                        <Download className="w-3.5 h-3.5" /> Tải về
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Col: Playlist / Syllabus */}
                <div className="bg-white rounded-2xl p-6 border border-[#E2E4EB] shadow-sm space-y-4 h-fit">
                    <h2 className="text-lg font-bold text-[#20223A]">Nội dung khóa học</h2>
                    <div className="space-y-2">
                        {lessons.map((item) => (
                            <Link
                                to={`/dashboard/video-lesson/${id}?lesson=${item.id}`}
                                key={item.id}
                                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${item.status === 'active'
                                        ? 'border-[#3C4097] bg-[#F4F5FF]'
                                        : 'border-[#E2E4EB] hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {item.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-[#6FAF7B]" />}
                                    {item.status === 'active' && <Play className="w-5 h-5 text-[#3C4097] fill-[#3C4097]" />}
                                    {item.status === 'locked' && <Lock className="w-5 h-5 text-gray-400" />}
                                    <div>
                                        <p className="text-xs font-bold text-[#20223A]">{item.title}</p>
                                        <span className="text-[11px] text-[#6B6D7A]">{item.duration}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
