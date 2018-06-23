class AddStateToIngredientAmount < ActiveRecord::Migration[5.2]
  def change
    add_column :ingredient_amounts, :state, :string
  end
end
