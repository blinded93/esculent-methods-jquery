class SearchService
  attr_accessor :term, :type
  def initialize(params)
    @term = params[:term]
    @type = params[:type]
  end

  def self.parse_and_create(string)
    type = string.match(/:[a-zA-Z]+ /)
    params = !!type ? {term:type.post_match, type:type.to_s.strip}:{term:string, type:":r"}
    SearchService.new(params)
  end

  def find_results
    case self.type
    when ":r"
      find_recipe
    when ":i"
      find_recipes_from_ingredients
    when ":u"
      find_user
    when ":ur"
      find_users_recipes
    else
      nil
    end
  end

  # private
    def find_recipe
      Recipe.search(self.term)
    end

    def find_recipes_from_ingredients
      ingredient_ids = self.term.split(",").map do |i|
        Ingredient.by_name(i.strip).try(:id)
      end
      Recipe.with_ingredients(ingredient_ids)
    end

    def find_user
      identifier = self.term.match(/^([^ \t]+).*/)[1]
      identifier.include?("@") ? User.from_email(identifier):User.from_username(identifier)
    end

    def find_users_recipes
      user = find_user.take
      Recipe.for(user)
    end
end
