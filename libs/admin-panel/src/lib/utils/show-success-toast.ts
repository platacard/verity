import { useToast } from '@verity/ui/use-toast';

export const useSuccessToast = (description: string) => {
  const { toast } = useToast();

  const showSuccessToast = () => {
    toast({
      variant: 'success',
      title: 'Success!',
      description,
    });
  };

  return showSuccessToast;
};
