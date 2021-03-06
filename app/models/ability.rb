class Ability
  include CanCan::Ability

  def initialize user
    user ||= User.new

    if user.admin?
      can :manage, :all
    else
      can :manage, [Address, Review, Comment], user_id: user.id
      can :read, :all
    end
  end
end
