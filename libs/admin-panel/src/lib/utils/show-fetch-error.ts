import { useToast } from '@verity/ui/use-toast';

export const useFetchErrorToast = () => {
  const { toast } = useToast();

  const showFetchError = () => {
    toast({
      variant: 'destructive',
      title: 'Oops!',
      description: 'Something went wrong while fetching data, see details in the console.',
    });
  };

  return showFetchError;
};
