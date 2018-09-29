class AddImageToRecipe < ActiveRecord::Migration[5.2]
  def change
    add_column :recipes, :image, :string
    change_column :recipes, :directions, :text
  end
end
