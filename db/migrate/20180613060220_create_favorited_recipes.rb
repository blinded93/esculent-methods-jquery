class CreateFavoritedRecipes < ActiveRecord::Migration[5.2]
  def change
    create_table :favorited_recipes do |t|
      t.text :notes
      t.resources :user
      t.resources :recipe

      t.timestamps
    end
  end
end
