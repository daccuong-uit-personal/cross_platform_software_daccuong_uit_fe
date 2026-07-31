import {
  Component, EventEmitter, Output, Input,
  signal, computed, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiButton } from '../../../button/button';
import { CreatePostPayload, PostPrivacy } from '@fe/domain/social';


@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, UiButton],
  selector: 'lib-create-post-modal',
  templateUrl: './create-post-modal.component.html',
  styleUrls: ['./create-post-modal.component.css'],
})
export class CreatePostModalComponent {
  @Input() isOpen = false;
  @Input() authorName = 'Bạn';
  @Input() authorAvatar = '';

  @Output() close = new EventEmitter<void>();
  @Output() submitPost = new EventEmitter<CreatePostPayload>();

  content = signal('');
  privacy = signal<PostPrivacy>('public');
  mediaFiles = signal<File[]>([]);
  mediaPreviews = signal<string[]>([]);
  hashtagsInput = signal('');
  isSubmitting = signal(false);

  canSubmit = computed(() =>
    !this.isSubmitting() &&
    (this.content().trim().length > 0 || this.mediaFiles().length > 0)
  );

  privacyOptions: { value: PostPrivacy; label: string; icon: string }[] = [
    { value: 'public', label: 'Công khai', icon: '🌍' },
    { value: 'friends', label: 'Bạn bè', icon: '👥' },
    { value: 'private', label: 'Chỉ mình tôi', icon: '🔒' },
  ];

  onClose() {
    this.close.emit();
    this.reset();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const newFiles = Array.from(input.files);
    this.mediaFiles.update(files => [...files, ...newFiles]);

    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.mediaPreviews.update(previews => [
            ...previews,
            e.target!.result as string
          ]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input so same file can be re-selected
    input.value = '';
  }

  removeMedia(index: number) {
    this.mediaFiles.update(files => files.filter((_, i) => i !== index));
    this.mediaPreviews.update(previews => previews.filter((_, i) => i !== index));
  }

  extractHashtags(text: string): string[] {
    const matches = text.match(/#[\w\u00C0-\u024F]+/g) ?? [];
    return [...new Set(matches.map(h => h.slice(1).toLowerCase()))];
  }

  onSubmit() {
    if (!this.canSubmit()) return;

    let finalContent = this.content().trim();
    if (this.hashtagsInput().trim()) {
      const tags = this.hashtagsInput()
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)
        .map(t => t.startsWith('#') ? t : `#${t}`)
        .join(' ');
      if (tags) {
        finalContent += `\n\n${tags}`;
      }
    }

    const payload: CreatePostPayload = {
      content: finalContent,
      images: this.mediaFiles(),
      hashtags: [], // hashtags will be auto-parsed by backend from the appended finalContent
      mentions: [],
      privacy: this.privacy(),
      allowComments: true,
    };

    this.isSubmitting.set(true);
    this.submitPost.emit(payload);
    this.reset();
  }

  private reset() {
    this.content.set('');
    this.mediaFiles.set([]);
    this.mediaPreviews.set([]);
    this.hashtagsInput.set('');
    this.privacy.set('public');
    this.isSubmitting.set(false);
  }
}
