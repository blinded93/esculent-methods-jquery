class CreateRecipes < ActiveRecord::Migration[5.2]
  def change
    create_table :recipes do |t|
      t.string :name
      t.string :directions
      t.integer :cook_time
      t.integer :prep_time
      t.integer :servings
      t.string :skill_level
      t.references :user

      t.timestamps
    end
  end
end
