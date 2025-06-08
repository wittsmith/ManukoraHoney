import { supabase } from '../supabaseClient';

// Create a user in both auth.users and usersnew
export const createUser = async ({ email, password, ...userData }) => {
  try {
    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // Then create the usersnew record
    const { data: userData, error: userError } = await supabase
      .from('usersnew')
      .insert([{
        id: authData.user.id,
        email,
        ...userData,
      }])
      .select()
      .single();

    if (userError) {
      // If usersnew creation fails, we should clean up the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw userError;
    }

    return { authData, userData };
  } catch (error) {
    throw error;
  }
};

// Update a user in both tables
export const updateUser = async (userId, { email, password, ...userData }) => {
  try {
    const updates = [];

    // Update auth user if email or password changed
    if (email || password) {
      const authUpdate = supabase.auth.admin.updateUserById(userId, {
        email,
        password,
      });
      updates.push(authUpdate);
    }

    // Update usersnew record
    const userUpdate = supabase
      .from('usersnew')
      .update(userData)
      .eq('id', userId)
      .select()
      .single();
    updates.push(userUpdate);

    const results = await Promise.all(updates);
    const errors = results.filter(result => result.error);
    
    if (errors.length > 0) {
      throw errors[0].error;
    }

    return results;
  } catch (error) {
    throw error;
  }
};

// Delete a user from both tables
export const deleteUser = async (userId) => {
  try {
    // Delete from usersnew first
    const { error: userError } = await supabase
      .from('usersnew')
      .delete()
      .eq('id', userId);

    if (userError) throw userError;

    // Then delete from auth.users
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    
    if (authError) throw authError;

    return true;
  } catch (error) {
    throw error;
  }
}; 