import { useRef, useState } from 'react'
import type { ChangeEvent, DragEvent, FormEvent } from 'react'
import './ProfileForm.css'

interface ProfileData {
  photo: File
  height: number
  weight: number
}

interface ProfileFormProps {
  onSubmit?: (data: ProfileData) => void
}

function ProfileForm({ onSubmit }: ProfileFormProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const applyPhoto = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드할 수 있어요.')
      return
    }
    setError(null)
    setPhotoFile(file)
    setPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) applyPhoto(file)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) applyPhoto(file)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!photoFile) {
      setError('본인 사진을 업로드해주세요.')
      return
    }
    const heightNum = Number(height)
    const weightNum = Number(weight)
    if (!heightNum || heightNum <= 0) {
      setError('키를 정확히 입력해주세요.')
      return
    }
    if (!weightNum || weightNum <= 0) {
      setError('몸무게를 정확히 입력해주세요.')
      return
    }

    setError(null)
    onSubmit?.({ photo: photoFile, height: heightNum, weight: weightNum })
  }

  const isValid = photoFile && Number(height) > 0 && Number(weight) > 0

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <header className="profile-form__header">
        <h1>퍼스널 스타일리스트</h1>
        <p>사진과 신체 정보를 입력하면 나에게 맞는 스타일을 추천해드려요.</p>
      </header>

      <div
        className={`photo-dropzone${isDragging ? ' is-dragging' : ''}${photoPreview ? ' has-photo' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="본인 사진 업로드"
      >
        {photoPreview ? (
          <img src={photoPreview} alt="업로드한 사진 미리보기" className="photo-preview" />
        ) : (
          <div className="photo-placeholder">
            <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
              />
              <path
                fill="currentColor"
                d="M9 3 7.17 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.17L15 3H9Zm3 14.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"
              />
            </svg>
            <span>사진을 드래그하거나 클릭해서 업로드하세요</span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          hidden
        />
      </div>

      {photoPreview && (
        <button
          type="button"
          className="photo-change"
          onClick={() => fileInputRef.current?.click()}
        >
          사진 다시 선택
        </button>
      )}

      <div className="field-row">
        <label className="field">
          <span className="field__label">키</span>
          <div className="field__input">
            <input
              type="number"
              inputMode="decimal"
              placeholder="170"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              min={0}
            />
            <span className="field__unit">cm</span>
          </div>
        </label>

        <label className="field">
          <span className="field__label">몸무게</span>
          <div className="field__input">
            <input
              type="number"
              inputMode="decimal"
              placeholder="60"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min={0}
            />
            <span className="field__unit">kg</span>
          </div>
        </label>
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="submit-btn" disabled={!isValid}>
        스타일 추천 받기
      </button>
    </form>
  )
}

export default ProfileForm
