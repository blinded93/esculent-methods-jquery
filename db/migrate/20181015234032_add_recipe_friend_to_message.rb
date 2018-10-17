class AddRecipeFriendToMessage < ActiveRecord::Migration[5.2]
  def change
    add_column :messages, :recipe_id, :integer
    add_column :messages, :user_id, :integer
  end
end
