import { ErrorCard, ErrorLayout } from "./error.ui";

interface ErrorProps {
  error: { message?: string };
  reset: () => void;
}

export function ErrorView(props: ErrorProps) {
  async function handleCopyClick() {
    if (props.error.message) {
      await navigator.clipboard.writeText(props.error.message);
    }
  }

  function handleReload() {
    location.reload();
  }

  return (
    <ErrorLayout>
      <ErrorCard>
        <ErrorCard.Container>
          <ErrorCard.Header />
          <ErrorCard.Content
            error={props.error}
            onReloadClick={handleReload}
            onCopyClick={handleCopyClick}
          />
        </ErrorCard.Container>
      </ErrorCard>
    </ErrorLayout>
  );
}
