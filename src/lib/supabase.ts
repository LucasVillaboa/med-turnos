import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mhqyeacufxlmhufiehnn.supabase.co";
const supabaseKey = "sb_publishable_cil-HuxPJBYhGYJxUMzbJA_YqUtjQgz";

export const supabase = createClient(supabaseUrl, supabaseKey);