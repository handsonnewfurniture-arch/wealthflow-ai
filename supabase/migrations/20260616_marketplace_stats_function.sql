-- Create function to get marketplace statistics
CREATE OR REPLACE FUNCTION public.get_marketplace_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total_listings', (SELECT COUNT(*) FROM marketplace_listings WHERE status = 'active'),
    'total_volume', COALESCE((SELECT SUM(asking_price) FROM marketplace_listings WHERE status = 'active'), 0),
    'avg_price', COALESCE((SELECT AVG(asking_price) FROM marketplace_listings WHERE status = 'active'), 0),
    'total_sales', (SELECT COUNT(*) FROM marketplace_purchases WHERE status = 'completed'),
    'sales_volume', COALESCE((SELECT SUM(final_price) FROM marketplace_purchases WHERE status = 'completed'), 0)
  ) INTO result;

  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_marketplace_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_marketplace_stats() TO anon;
