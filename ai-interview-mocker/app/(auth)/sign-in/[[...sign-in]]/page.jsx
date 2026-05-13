import { SignIn } from '@clerk/nextjs';
import styles from './sign-in.module.css';

export default function Page() {
  return (
    <main className={styles.signInPage}>
      <section className={styles.brandPanel}>
        <div>
          <h1>AI Interviewer</h1>
          <p className={styles.tagline}>
            Practice interviews, record answers, and get focused feedback before the real conversation.
          </p>
        </div>
        <div className={styles.featureList} aria-label="Product highlights">
          <span>Role-based questions</span>
          <span>Voice answer practice</span>
          <span>AI feedback reports</span>
        </div>
      </section>

      <div className={styles.authPanel}>
        <div className={styles.authHeader}>
          <h2>Welcome back</h2>
          <p>Sign in to continue to your interview dashboard.</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: styles.clerkRoot,
              cardBox: styles.clerkCard,
              headerTitle: styles.clerkHidden,
              headerSubtitle: styles.clerkHidden,
              socialButtonsBlockButton: styles.socialButton,
              formButtonPrimary: styles.primaryButton,
              footerActionLink: styles.footerLink,
            },
          }}
        />
      </div>
    </main>
  );
}
