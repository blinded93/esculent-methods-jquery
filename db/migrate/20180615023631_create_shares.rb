class CreateShares < ActiveRecord::Migration[5.2]
  def change
    create_table :shares do |t|
      t.integer :recipe_id
      t.integer :user_id
      t.integer :friend_id

      t.timestamps
    end
  end
end
